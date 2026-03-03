# routes/rld_direction_routes.py
import os, json, random
from flask import Blueprint, request, jsonify, current_app
from flask_cors import cross_origin
from werkzeug.utils import secure_filename
from bson import ObjectId
from database.db import mongo
from models.rld_direction_model import RLD_Direction_Set

rld_direction_bp = Blueprint("rld_direction_bp", __name__)

@rld_direction_bp.after_request
def add_cors(response):
    response.headers["Access-Control-Allow-Origin"]  = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    return response

def save_img(file):
    folder = current_app.config["RLD_UPLOAD_FOLDER"]
    os.makedirs(folder, exist_ok=True)
    name = secure_filename(file.filename)
    file.save(os.path.join(folder, name))
    return f"http://localhost:5000/rld_uploads/{name}"


# POST /api/rld_direction_bp/add_direction_set
@rld_direction_bp.route("/add_direction_set", methods=["POST", "OPTIONS"])
@cross_origin()
def add_direction_set():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    try:
        level    = request.form.get("level")
        question = request.form.get("question")
        scene    = save_img(request.files["scene_image"])

        # options JSON: [{ correct_zone: "left" }, ...]
        options_meta = json.loads(request.form.get("options"))
        options = []
        for i, meta in enumerate(options_meta):
            options.append({
                "image_url":    save_img(request.files[f"option_image_{i}"]),
                "correct_zone": meta["correct_zone"],   # "left"|"right"|"top"|"bottom"
            })

        mongo.db.rld_direction_sets.insert_one(
            RLD_Direction_Set(level, scene, question, options).to_dict()
        )
        return jsonify({"message": "Direction set added successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# GET /api/rld_direction_bp/get_direction_set/<level>
@rld_direction_bp.route("/get_direction_set/<level>", methods=["GET", "OPTIONS"])
@cross_origin()
def get_direction_set(level):
    if request.method == "OPTIONS":
        return jsonify({}), 200
    sets = list(mongo.db.rld_direction_sets.find({"level": level}))
    if not sets:
        return jsonify({"message": "No sets found for this level"}), 404
    s = random.choice(sets)
    return jsonify({
        "set_id":          str(s["_id"]),
        "scene_image_url": s["scene_image_url"],
        "question":        s["question"],
        "level":           s["level"],
        # correct_zone is hidden from student — only image_url sent
        "options": [{"image_url": o["image_url"]} for o in s["options"]],
    })


# POST /api/rld_direction_bp/submit_direction_level
@rld_direction_bp.route("/submit_direction_level", methods=["POST", "OPTIONS"])
@cross_origin()
def submit_direction_level():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    data      = request.get_json()
    set_id    = data.get("set_id")
    # answers: [{ image_url, dropped_zone }]
    answers   = data.get("answers")

    s = mongo.db.rld_direction_sets.find_one({"_id": ObjectId(set_id)})
    if not s:
        return jsonify({"error": "Invalid set ID"}), 400

    correct = 0
    for opt in s["options"]:
        for ans in answers:
            if ans["image_url"] == opt["image_url"]:
                if ans["dropped_zone"] == opt["correct_zone"]:
                    correct += 1

    total = len(s["options"])
    return jsonify({
        "score":   round(correct / total * 100, 2) if total else 0,
        "correct": correct,
        "total":   total,
        "level":   s["level"],
    })

@rld_direction_bp.route("/admin_get_sets/<level>", methods=["GET", "OPTIONS"])
@cross_origin()
def admin_get_direction_sets(level):
    if request.method == "OPTIONS":
        return jsonify({}), 200
    sets = list(mongo.db.rld_direction_sets.find({"level": level}))
    results = []
    for s in sets:
        results.append({
            "set_id":          str(s["_id"]),
            "level":           s["level"],
            "scene_image_url": s["scene_image_url"],
            "question":        s["question"],
            "options":         s["options"],    # includes correct_zone
            "created_at":      str(s.get("created_at", "")),
        })
    return jsonify(results)

@rld_direction_bp.route("/delete_set/<set_id>", methods=["DELETE", "OPTIONS"])
@cross_origin(methods=["DELETE", "OPTIONS"])
def delete_direction_set(set_id):
    if request.method == "OPTIONS":
        return jsonify({}), 200
    result = mongo.db.rld_direction_sets.delete_one({"_id": ObjectId(set_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Not found"}), 404
    return jsonify({"message": "Deleted successfully"})

@rld_direction_bp.route("/update_set/<set_id>", methods=["PUT", "OPTIONS"])
@cross_origin()
def update_direction_set(set_id):
    if request.method == "OPTIONS":
        return jsonify({}), 200
    try:
        level    = request.form.get("level")
        question = request.form.get("question")

        update_fields = {}
        if level:
            update_fields["level"] = level
        if question:
            update_fields["question"] = question

        # Update scene image only if a new one is uploaded
        if "scene_image" in request.files:
            update_fields["scene_image_url"] = save_img(request.files["scene_image"])

        # Update options
        if "options" in request.form:
            options_meta = json.loads(request.form.get("options"))
            options = []
            for i, meta in enumerate(options_meta):
                opt = {"correct_zone": meta["correct_zone"]}
                # Use new image if uploaded, otherwise keep existing URL
                if f"option_image_{i}" in request.files:
                    opt["image_url"] = save_img(request.files[f"option_image_{i}"])
                else:
                    opt["image_url"] = meta.get("image_url", "")
                options.append(opt)
            update_fields["options"] = options

        mongo.db.rld_direction_sets.update_one(
            {"_id": ObjectId(set_id)},
            {"$set": update_fields}
        )
        return jsonify({"message": "Direction set updated successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400
