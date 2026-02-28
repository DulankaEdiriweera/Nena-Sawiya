import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from database.db import mongo
from datetime import datetime

sequencing_bp = Blueprint("sequencing_bp", __name__)

# Add new sequencing activity
@sequencing_bp.route("/add", methods=["POST"])
def add_sequencing_activity():
    level = request.form.get("level")  # EASY, MEDIUM, HARD
    title = request.form.get("title")
    task_number = int(request.form.get("task_number"))

    # Correct order should come as comma separated string: "1,2,3"
    correct_order_str = request.form.get("correct_order")
    correct_order = list(map(int, correct_order_str.split(",")))

    images = request.files.getlist("images")  # multiple images

    os.makedirs(current_app.config['UPLOAD_FOLDER'], exist_ok=True)

    image_list = []
    image_id = 1

    for image in images:
        filename = secure_filename(image.filename)
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        image.save(filepath)

        image_url = f"/uploads/{filename}"

        image_list.append({
            "id": image_id,
            "url": image_url
        })

        image_id += 1

    record = {
        "level": level.upper(),
        "title": title,
        "images": image_list,
        "correct_order": correct_order,
        "task_number": task_number,
        "created_at": datetime.utcnow()
    }

    mongo.db.sequencing.insert_one(record)

    return jsonify({"message": "Sequencing activity added successfully"})

# Get sequencing activities by level
@sequencing_bp.route("/level/<level>", methods=["GET"])
def get_sequencing_by_level(level):
    activities = list(
        mongo.db.sequencing.find({"level": level.upper()}, {"_id": 0})
    )
    return jsonify(activities)