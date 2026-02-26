from flask import Blueprint, request, jsonify, current_app
from database.db import mongo
from bson import ObjectId
from werkzeug.utils import secure_filename
import os
import json
import random
from models.rld_direction_model import RLD_Direction_Set

rld_direction_bp = Blueprint("rld_direction_bp", __name__)

# =====================================================
# ADMIN: ADD FULL DIRECTION SET WITH IMAGE UPLOAD
# =====================================================
@rld_direction_bp.route("/add_direction_set", methods=["POST"])
def add_direction_set():
    """
    Expects multipart/form-data with:
    - easy_image, medium_image, hard_image (files)
    - easy_question, medium_question, hard_question (strings)
    - easy_items, medium_items, hard_items (JSON strings)
    """
    # --- Save uploaded images ---
    easy_image = request.files.get("easy_image")
    medium_image = request.files.get("medium_image")
    hard_image = request.files.get("hard_image")

    if not (easy_image and medium_image and hard_image):
        return jsonify({"error": "All 3 images must be uploaded"}), 400

    # Secure filenames
    easy_filename = secure_filename(easy_image.filename)
    medium_filename = secure_filename(medium_image.filename)
    hard_filename = secure_filename(hard_image.filename)

    # Save files to rld_uploads folder
    easy_image.save(os.path.join(current_app.config["UPLOAD_FOLDER"], easy_filename))
    medium_image.save(os.path.join(current_app.config["UPLOAD_FOLDER"], medium_filename))
    hard_image.save(os.path.join(current_app.config["UPLOAD_FOLDER"], hard_filename))

    # --- Get questions and items ---
    try:
        easy_question = request.form.get("easy_question")
        medium_question = request.form.get("medium_question")
        hard_question = request.form.get("hard_question")

        easy_items = json.loads(request.form.get("easy_items"))
        medium_items = json.loads(request.form.get("medium_items"))
        hard_items = json.loads(request.form.get("hard_items"))
    except Exception as e:
        return jsonify({"error": f"Invalid JSON for items: {str(e)}"}), 400

    # --- Create RLD_Direction_Set object ---
    direction_set = RLD_Direction_Set(
        easy={
            "image_url": f"http://localhost:5000/rld_uploads/{easy_filename}",
            "question": easy_question,
            "items": easy_items
        },
        medium={
            "image_url": f"http://localhost:5000/rld_uploads/{medium_filename}",
            "question": medium_question,
            "items": medium_items
        },
        hard={
            "image_url": f"http://localhost:5000/rld_uploads/{hard_filename}",
            "question": hard_question,
            "items": hard_items
        }
    )

    # Save to MongoDB
    mongo.db.rld_direction_sets.insert_one(direction_set.to_dict())

    return jsonify({"message": "Direction set added with images successfully"})


# =====================================================
# STUDENT: GET RANDOM DIRECTION SET
# =====================================================
@rld_direction_bp.route("/get_direction_set", methods=["GET"])
def get_direction_set():
    """
    Returns a random direction set with answers hidden.
    """
    sets = list(mongo.db.rld_direction_sets.find())

    if not sets:
        return jsonify({"message": "No direction sets available"}), 404

    selected_set = random.choice(sets)

    # Hide correct answers
    def hide_answers(level_data):
        return {
            "image_url": level_data["image_url"],
            "question": level_data["question"],
            "items": [
                {"name": item["name"]}
                for item in level_data["items"]
            ]
        }

    return jsonify({
        "set_id": str(selected_set["_id"]),
        "easy": hide_answers(selected_set["easy"]),
        "medium": hide_answers(selected_set["medium"]),
        "hard": hide_answers(selected_set["hard"])
    })


# =====================================================
# STUDENT: SUBMIT LEVEL ANSWERS
# =====================================================
@rld_direction_bp.route("/submit_direction_level", methods=["POST"])
def submit_direction_level():
    """
    Expects JSON:
    {
        "set_id": "<MongoDB set _id>",
        "level": "easy|medium|hard",
        "answers": {"Tree": "North", "Car": "East"}
    }
    """
    data = request.get_json()

    set_id = data.get("set_id")
    level = data.get("level")  # "easy", "medium", "hard"
    answers = data.get("answers")

    if not (set_id and level and answers):
        return jsonify({"error": "Missing required fields"}), 400

    direction_set = mongo.db.rld_direction_sets.find_one({"_id": ObjectId(set_id)})

    if not direction_set:
        return jsonify({"error": "Invalid set ID"}), 400

    correct_items = direction_set[level]["items"]

    total = len(correct_items)
    correct_count = 0

    for item in correct_items:
        name = item["name"]
        if answers.get(name) == item["correct_direction"]:
            correct_count += 1

    score = round((correct_count / total) * 100, 2)

    return jsonify({
        "level": level,
        "score": score,
        "correct": correct_count,
        "total": total
    })