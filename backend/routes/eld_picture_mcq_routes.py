import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from database.db import mongo
from datetime import datetime
from bson.objectid import ObjectId

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


# Get all MCQs
@picture_bp.route("/all", methods=["GET"])
def get_all_mcqs():
    mcqs = list(
        mongo.db.picture_mcq.find({}, {"_id": 1, "level": 1, "question": 1, "options": 1, "correct_answer": 1, "image_url": 1, "task_number": 1})
    )
    # Convert ObjectId to string
    for mcq in mcqs:
        mcq["_id"] = str(mcq["_id"])
    return jsonify(mcqs)


# Update MCQ by id
@picture_bp.route("/update/<mcq_id>", methods=["PUT"])
def update_mcq(mcq_id):
    data = request.form.to_dict()
    options = request.form.getlist("options")
    if options:
        data["options"] = options

    # Handle image update
    if "image" in request.files:
        image = request.files["image"]
        os.makedirs(current_app.config['UPLOAD_FOLDER'], exist_ok=True)
        filename = secure_filename(image.filename)
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        image.save(filepath)
        data["image_url"] = f"/uploads/{filename}"

    if "level" in data:
        data["level"] = data["level"].upper()

    data["updated_at"] = datetime.utcnow()

    result = mongo.db.picture_mcq.update_one(
        {"_id": ObjectId(mcq_id)},
        {"$set": data}
    )

    if result.matched_count:
        return jsonify({"message": "MCQ updated successfully"})
    else:
        return jsonify({"error": "MCQ not found"}), 404


# Delete MCQ by id
@picture_bp.route("/delete/<mcq_id>", methods=["DELETE"])
def delete_mcq(mcq_id):
    result = mongo.db.picture_mcq.delete_one({"_id": ObjectId(mcq_id)})
    if result.deleted_count:
        return jsonify({"message": "MCQ deleted successfully"})
    else:
        return jsonify({"error": "MCQ not found"}), 404