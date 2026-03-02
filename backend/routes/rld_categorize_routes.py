# routes/rld_categorize_routes.py
import os, json, random
from flask import Blueprint, request, jsonify, current_app
from flask_cors import cross_origin
from werkzeug.utils import secure_filename
from bson import ObjectId
from database.db import mongo
from models.rld_categorize_model import RLD_Categorize_Set

rld_categorize_bp = Blueprint("rld_categorize_bp", __name__)

@rld_categorize_bp.after_request
def add_cors(response):
    response.headers["Access-Control-Allow-Origin"]  = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    return response

LEVEL_RULES = {
    "easy":   {"bags": 2, "options": 4},
    "medium": {"bags": 2, "options": 6},
    "hard":   {"bags": 3, "options": 8},
}

def save_img(file):
    folder = current_app.config["RLD_UPLOAD_FOLDER"]
    os.makedirs(folder, exist_ok=True)
    name = secure_filename(file.filename)
    file.save(os.path.join(folder, name))
    return f"http://localhost:5000/rld_uploads/{name}"


# POST /api/rld_categorize/add_set
@rld_categorize_bp.route("/add_set", methods=["POST", "OPTIONS"])
@cross_origin()
def add_set():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    try:
        print("FORM:", list(request.form.keys()))
        print("FILES:", list(request.files.keys()))

        level       = request.form.get("level")
        instruction = request.form.get("instruction")
        rules       = LEVEL_RULES.get(level)
        if not rules:
            return jsonify({"error": "Invalid level"}), 400

        # Bags: [{ label }] — image uploaded separately as bag_image_0, bag_image_1 ...
        bags_meta = json.loads(request.form.get("bags"))
        bags = []
        for i, meta in enumerate(bags_meta):
            bags.append({
                "label":     meta["label"],
                "image_url": save_img(request.files[f"bag_image_{i}"]),
            })

        # Options: [{ correct_bag }] — image uploaded as option_image_0 ...
        options_meta = json.loads(request.form.get("options"))
        options = []
        for i, meta in enumerate(options_meta):
            options.append({
                "image_url":   save_img(request.files[f"option_image_{i}"]),
                "correct_bag": meta["correct_bag"],
            })

        mongo.db.rld_categorize_sets.insert_one(
            RLD_Categorize_Set(level, instruction, bags, options).to_dict()
        )
        return jsonify({"message": "Category set added successfully!"})
    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)}), 400


# GET /api/rld_categorize/get_set/<level>
@rld_categorize_bp.route("/get_set/<level>", methods=["GET", "OPTIONS"])
@cross_origin()
def get_set(level):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    sets = list(mongo.db.rld_categorize_sets.find({"level": level}))
    if not sets:
        return jsonify({"error": "No sets found for this level"}), 404

    s = random.choice(sets)

    # Shuffle options order for each student
    options = s["options"][:]
    random.shuffle(options)

    return jsonify({
        "set_id":      str(s["_id"]),
        "instruction": s["instruction"],
        "level":       s["level"],
        "bags":        s["bags"],          # [{ label, image_url }]
        "options": [{"image_url": o["image_url"]} for o in options],  # correct_bag hidden
    })


# POST /api/rld_categorize/submit
@rld_categorize_bp.route("/submit", methods=["POST", "OPTIONS"])
@cross_origin()
def submit():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    data    = request.get_json()
    set_id  = data.get("set_id")
    answers = data.get("answers")   # [{ image_url, dropped_bag }]

    s = mongo.db.rld_categorize_sets.find_one({"_id": ObjectId(set_id)})
    if not s:
        return jsonify({"error": "Invalid set ID"}), 400

    correct = 0
    feedback = []
    for opt in s["options"]:
        for ans in answers:
            if ans["image_url"] == opt["image_url"]:
                is_correct = ans["dropped_bag"] == opt["correct_bag"]
                if is_correct:
                    correct += 1
                feedback.append({
                    "image_url":    opt["image_url"],
                    "dropped_bag":  ans["dropped_bag"],
                    "correct_bag":  opt["correct_bag"],
                    "is_correct":   is_correct,
                })

    total = len(s["options"])
    return jsonify({
        "score":    round(correct / total * 100, 2) if total else 0,
        "correct":  correct,
        "total":    total,
        "feedback": feedback,   # per-image result shown after submit
    })

@rld_categorize_bp.route("/admin_get_sets/<level>", methods=["GET", "OPTIONS"])
@cross_origin()
def admin_get_sets(level):
    if request.method == "OPTIONS":
        return jsonify({}), 200
    sets = list(mongo.db.rld_categorize_sets.find({"level": level}))
    results = []
    for s in sets:
        results.append({
            "set_id":      str(s["_id"]),
            "level":       s["level"],
            "instruction": s["instruction"],
            "bags":        s["bags"],
            "options":     s["options"],        # includes correct_bag
            "created_at":  str(s.get("created_at", "")),
        })
    return jsonify(results)

@rld_categorize_bp.route("/delete_set/<set_id>", methods=["DELETE", "OPTIONS"])
@cross_origin(methods=["DELETE", "OPTIONS"])
def delete_categorize_set(set_id):
    if request.method == "OPTIONS":
        return jsonify({}), 200
    result = mongo.db.rld_categorize_sets.delete_one({"_id": ObjectId(set_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Not found"}), 404
    return jsonify({"message": "Deleted successfully"})

@rld_categorize_bp.route("/update_set/<set_id>", methods=["PUT", "OPTIONS"])
@cross_origin()
def update_categorize_set(set_id):
    if request.method == "OPTIONS":
        return jsonify({}), 200
    try:
        update_fields = {}

        level       = request.form.get("level")
        instruction = request.form.get("instruction")
        if level:
            update_fields["level"] = level
        if instruction is not None:
            update_fields["instruction"] = instruction

        # Update bags
        if "bags" in request.form:
            bags_meta = json.loads(request.form.get("bags"))
            bags = []
            for i, meta in enumerate(bags_meta):
                bag = {"label": meta["label"]}
                if f"bag_image_{i}" in request.files:
                    bag["image_url"] = save_img(request.files[f"bag_image_{i}"])
                else:
                    bag["image_url"] = meta.get("image_url", "")
                bags.append(bag)
            update_fields["bags"] = bags

        # Update options
        if "options" in request.form:
            options_meta = json.loads(request.form.get("options"))
            options = []
            for i, meta in enumerate(options_meta):
                opt = {"correct_bag": meta["correct_bag"]}
                if f"option_image_{i}" in request.files:
                    opt["image_url"] = save_img(request.files[f"option_image_{i}"])
                else:
                    opt["image_url"] = meta.get("image_url", "")
                options.append(opt)
            update_fields["options"] = options

        mongo.db.rld_categorize_sets.update_one(
            {"_id": ObjectId(set_id)},
            {"$set": update_fields}
        )
        return jsonify({"message": "Categorize set updated successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400
