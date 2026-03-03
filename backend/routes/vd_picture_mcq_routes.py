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
# Update question (text, level, task_number, correct_index)
# -------------------------------
@vd_picture_bp.route("/update/<question_id>", methods=["PUT"])
def update_picture_mcq(question_id):
    try:
        data = request.get_json()
        allowed_fields = ["level", "task_number", "question_text", "correct_index"]
        update_data = {k: v for k, v in data.items() if k in allowed_fields}

        if "level" in update_data:
            update_data["level"] = update_data["level"].upper()

        # If correct_index changed, recalculate marks
        q = get_question_by_id(question_id)
        if not q:
            return jsonify({"error": "Question not found"}), 404

        if "correct_index" in update_data:
            new_correct = int(update_data["correct_index"])
            answers = q["answers"]
            # Find old mark value (from previously correct answer)
            old_mark = max(a["mark"] for a in answers)
            for i, a in enumerate(answers):
                a["mark"] = old_mark if i == new_correct else 0
            update_data["answers"] = answers
            del update_data["correct_index"]

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
