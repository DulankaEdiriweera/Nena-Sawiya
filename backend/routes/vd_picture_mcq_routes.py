import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from database.db import mongo
from models.vd_picture_mcq_model import (
    get_all_questions,
    get_questions_by_level,
    get_question_by_id,
    update_question,
    delete_question,
)
from datetime import datetime

vd_picture_bp = Blueprint("vd_picture_bp", __name__)


# -------------------------------
# Add new VD Picture MCQ
# -------------------------------
@vd_picture_bp.route("/add", methods=["POST"])
def add_picture_mcq():
    try:
        level = request.form.get("level")
        task_number = int(request.form.get("task_number"))
        question_text = request.form.get("question")
        correct_index = int(request.form.get("correct_index"))
        marks = list(map(int, request.form.getlist("marks")))

        question_image = request.files["question_image"]
        answer_files = request.files.getlist("answer_images")

        if len(answer_files) != 5:
            return jsonify({"error": "Exactly 5 answer images are required"}), 400

        vd_upload_folder = current_app.config["VD_UPLOAD_FOLDER"]
        os.makedirs(vd_upload_folder, exist_ok=True)

        # Save question image
        q_filename = secure_filename(question_image.filename)
        q_path = os.path.join(vd_upload_folder, q_filename)
        question_image.save(q_path)
        question_image_url = f"/vd_uploads/{q_filename}"

        # Save answer images
        answers = []
        for i, file in enumerate(answer_files):
            filename = secure_filename(file.filename)
            filepath = os.path.join(vd_upload_folder, filename)
            file.save(filepath)
            answers.append({
                "image_url": f"/vd_uploads/{filename}",
                "mark": marks[i] if i == correct_index else 0
            })

        record = {
            "level": level.upper(),
            "task_number": task_number,
            "question_text": question_text,
            "question_image": question_image_url,
            "answers": answers,
            "created_at": datetime.utcnow()
        }

        mongo.db.vd_picture_mcq_questions.insert_one(record)
        return jsonify({"message": "VD Picture MCQ added successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------
# Get all questions (Admin)
# -------------------------------
@vd_picture_bp.route("/all", methods=["GET"])
def get_all():
    try:
        questions = get_all_questions()
        return jsonify(questions), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------
# Get MCQs by level (User)
# -------------------------------
@vd_picture_bp.route("/level/<level>", methods=["GET"])
def get_mcqs_by_level(level):
    try:
        questions = get_questions_by_level(level)
        return jsonify(questions), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------
# Get single question by ID
# -------------------------------
@vd_picture_bp.route("/<question_id>", methods=["GET"])
def get_single(question_id):
    try:
        q = get_question_by_id(question_id)
        if not q:
            return jsonify({"error": "Question not found"}), 404
        return jsonify(q), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------
# Update question — supports image replacement via multipart/form-data
# -------------------------------
@vd_picture_bp.route("/update/<question_id>", methods=["PUT"])
def update_picture_mcq(question_id):
    try:
        vd_upload_folder = current_app.config["VD_UPLOAD_FOLDER"]
        os.makedirs(vd_upload_folder, exist_ok=True)

        # Read text fields from form data
        level        = request.form.get("level")
        task_number  = request.form.get("task_number")
        question_text = request.form.get("question_text")
        correct_index = request.form.get("correct_index")

        # Fetch existing question from DB
        q = get_question_by_id(question_id)
        if not q:
            return jsonify({"error": "Question not found"}), 404

        update_data = {}

        if level:
            update_data["level"] = level.upper()
        if task_number is not None:
            update_data["task_number"] = int(task_number)
        if question_text:
            update_data["question_text"] = question_text

        # Handle question image replacement
        if "question_image" in request.files:
            q_file = request.files["question_image"]
            if q_file and q_file.filename:
                q_filename = secure_filename(q_file.filename)
                q_file.save(os.path.join(vd_upload_folder, q_filename))
                update_data["question_image"] = f"/vd_uploads/{q_filename}"

        # Handle answer images + correct_index update
        answers = q["answers"]

        # Replace any answer images that were uploaded
        for i in range(5):
            key = f"answer_image_{i}"
            if key in request.files:
                file = request.files[key]
                if file and file.filename:
                    filename = secure_filename(file.filename)
                    file.save(os.path.join(vd_upload_folder, filename))
                    answers[i]["image_url"] = f"/vd_uploads/{filename}"

        # Recalculate marks if correct_index changed
        if correct_index is not None:
            new_correct = int(correct_index)
            old_mark = max((a["mark"] for a in answers), default=1)
            if old_mark == 0:
                old_mark = 1
            for i, a in enumerate(answers):
                a["mark"] = old_mark if i == new_correct else 0

        update_data["answers"] = answers

        success = update_question(question_id, update_data)
        if success:
            return jsonify({"message": "Question updated successfully"}), 200
        return jsonify({"error": "No changes made"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------
# Delete question
# -------------------------------
@vd_picture_bp.route("/delete/<question_id>", methods=["DELETE"])
def delete_picture_mcq(question_id):
    try:
        success = delete_question(question_id)
        if success:
            return jsonify({"message": "Question deleted successfully"}), 200
        return jsonify({"error": "Question not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500