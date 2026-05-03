import os, json, random
from flask import Blueprint, request, jsonify, current_app
from flask_cors import cross_origin
from werkzeug.utils import secure_filename
from bson import ObjectId
from database.db import mongo
from models.rld_direction_model import RLD_Direction_Set

rld_direction_bp = Blueprint("rld_direction_bp", __name__)

# save file
def save_file(file):
    if not file:
        return None
    folder = current_app.config["RLD_UPLOAD_FOLDER"]
    os.makedirs(folder, exist_ok=True)
    name = secure_filename(file.filename)
    path = os.path.join(folder, name)
    file.save(path)
    return f"http://localhost:5000/rld_uploads/{name}"

# post
@rld_direction_bp.route("/add_direction_set", methods=["POST"])
@cross_origin()
def add_direction_set():
    try:
        level = request.form.get("level")
        question = request.form.get("question")

        scene = save_file(request.files.get("scene_image"))
        audio = save_file(request.files.get("question_audio"))

        options_meta = json.loads(request.form.get("options"))
        options = []

        for i, meta in enumerate(options_meta):
            img = save_file(request.files.get(f"option_image_{i}"))
            options.append({
                "image_url": img,
                "correct_zone": meta["correct_zone"]
            })

        mongo.db.rld_direction_sets.insert_one(
            RLD_Direction_Set(level, scene, question, audio, options).to_dict()
        )

        return jsonify({"message": "Added successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# retrieve
@rld_direction_bp.route("/get_direction_set/<level>", methods=["GET"])
@cross_origin()
def get_direction_set(level):
    sets = list(mongo.db.rld_direction_sets.find({"level": level}))
    if not sets:
        return jsonify({"message": "No sets"}), 404

    s = random.choice(sets)

    return jsonify({
        "set_id": str(s["_id"]),
        "scene_image_url": s["scene_image_url"],
        "question": s["question"],
        "question_audio_url": s.get("question_audio_url"),
        "level": s["level"],
        "options": [{"image_url": o["image_url"]} for o in s["options"]],
    })

# add level
@rld_direction_bp.route("/submit_direction_level", methods=["POST"])
@cross_origin()
def submit_direction_level():
    data = request.get_json()
    s = mongo.db.rld_direction_sets.find_one({"_id": ObjectId(data["set_id"])})

    correct = 0
    for opt in s["options"]:
        for ans in data["answers"]:
            if ans["image_url"] == opt["image_url"]:
                if ans["dropped_zone"] == opt["correct_zone"]:
                    correct += 1

    total = len(s["options"])

    return jsonify({
        "score": round(correct / total * 100, 2),
        "correct": correct,
        "total": total,
        "level": s["level"],
    })

# retrieve direction level
@rld_direction_bp.route("/admin_get_sets/<level>", methods=["GET"])
@cross_origin()
def admin_get_sets(level):
    sets = list(mongo.db.rld_direction_sets.find({"level": level}))
    return jsonify([{
        "set_id": str(s["_id"]),
        "level": s["level"],
        "scene_image_url": s["scene_image_url"],
        "question": s["question"],
        "question_audio_url": s.get("question_audio_url"),
        "options": s["options"],
    } for s in sets])

# delete direction set
@rld_direction_bp.route("/delete_set/<set_id>", methods=["DELETE"])
@cross_origin()
def delete_set(set_id):
    mongo.db.rld_direction_sets.delete_one({"_id": ObjectId(set_id)})
    return jsonify({"message": "Deleted"})

# update direction set
@rld_direction_bp.route("/update_set/<set_id>", methods=["PUT"])
@cross_origin()
def update_set(set_id):
    try:
        s = mongo.db.rld_direction_sets.find_one({"_id": ObjectId(set_id)})
        if not s:
            return jsonify({"error": "Not found"}), 404

        update = {}

        if request.form.get("level"):
            update["level"] = request.form.get("level")

        if request.form.get("question"):
            update["question"] = request.form.get("question")

        if "scene_image" in request.files:
            update["scene_image_url"] = save_file(request.files["scene_image"])

        if "question_audio" in request.files:
            update["question_audio_url"] = save_file(request.files["question_audio"])

        if "options" in request.form:
            meta = json.loads(request.form.get("options"))
            new_opts = []

            for i, m in enumerate(meta):
                file = request.files.get(f"option_image_{i}")
                img = save_file(file) if file else m["image_url"]

                new_opts.append({
                    "image_url": img,
                    "correct_zone": m["correct_zone"]
                })

            update["options"] = new_opts

        mongo.db.rld_direction_sets.update_one(
            {"_id": ObjectId(set_id)},
            {"$set": update}
        )

        return jsonify({"message": "Updated"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400