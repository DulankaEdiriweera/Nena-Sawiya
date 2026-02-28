import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from database.db import mongo
from datetime import datetime
from bson.objectid import ObjectId

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



# Get all sequencing activities
@sequencing_bp.route("/all", methods=["GET"])
def get_all_sequencing():
    activities = list(
        mongo.db.sequencing.find({}, {"_id": 1, "level": 1, "title": 1, "images": 1, "correct_order": 1, "task_number": 1})
    )
    for act in activities:
        act["_id"] = str(act["_id"])
    return jsonify(activities)


# Update sequencing activity by id
@sequencing_bp.route("/update/<activity_id>", methods=["PUT"])
def update_sequencing(activity_id):
    data = request.form.to_dict()
    images = request.files.getlist("images")

    os.makedirs(current_app.config['UPLOAD_FOLDER'], exist_ok=True)

    # If new images are uploaded, replace them
    if images:
        image_list = []
        for idx, image in enumerate(images, start=1):
            filename = secure_filename(image.filename)
            filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            image.save(filepath)
            image_list.append({"id": idx, "url": f"/uploads/{filename}"})
        data["images"] = image_list

    # Update correct order if provided
    if "correct_order" in data:
        data["correct_order"] = list(map(int, data["correct_order"].split(",")))

    if "level" in data:
        data["level"] = data["level"].upper()

    data["updated_at"] = datetime.utcnow()

    result = mongo.db.sequencing.update_one(
        {"_id": ObjectId(activity_id)},
        {"$set": data}
    )

    if result.matched_count:
        return jsonify({"message": "Sequencing activity updated successfully"})
    else:
        return jsonify({"error": "Activity not found"}), 404


# Delete sequencing activity by id
@sequencing_bp.route("/delete/<activity_id>", methods=["DELETE"])
def delete_sequencing(activity_id):
    result = mongo.db.sequencing.delete_one({"_id": ObjectId(activity_id)})
    if result.deleted_count:
        return jsonify({"message": "Sequencing activity deleted successfully"})
    else:
        return jsonify({"error": "Activity not found"}), 404