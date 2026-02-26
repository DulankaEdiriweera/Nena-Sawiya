import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from database.db import mongo
from datetime import datetime

picture_bp = Blueprint("picture_bp", __name__)

# Add new picture MCQ
@picture_bp.route("/add", methods=["POST"])
def add_picture_mcq():
    level = request.form.get("level")  # EASY, MEDIUM, HARD
    question = request.form.get("question")
    options = request.form.getlist("options")  # multiple options
    correct_answer = request.form.get("correct_answer")
    task_number = int(request.form.get("task_number"))
    image = request.files["image"]

    os.makedirs(current_app.config['UPLOAD_FOLDER'], exist_ok=True)
    filename = secure_filename(image.filename)
    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    image.save(filepath)

    image_url = f"/uploads/{filename}"  # relative path for frontend

    record = {
        "level": level.upper(),
        "question": question,
        "options": options,
        "correct_answer": correct_answer,
        "image_url": image_url,
        "task_number": task_number,
        "created_at": datetime.utcnow()
    }

    mongo.db.picture_mcq.insert_one(record)
    return jsonify({"message": "Picture MCQ added successfully"})


# Get all MCQs by level
@picture_bp.route("/level/<level>", methods=["GET"])
def get_mcqs_by_level(level):
    mcqs = list(
        mongo.db.picture_mcq.find({"level": level.upper()}, {"_id": 0})
    )
    return jsonify(mcqs)