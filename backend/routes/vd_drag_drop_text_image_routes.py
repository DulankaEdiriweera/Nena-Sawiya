import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from database.db import mongo
from datetime import datetime
from bson import ObjectId
from models.vd_drag_text_model import vd_drag_text_schema, vd_drag_item_schema

vd_drag_text_bp = Blueprint("vd_drag_text_bp", __name__)


# -------------------------------------------------------
# POST /api/vd_drag_text/add
# Add a new activity (admin)
# -------------------------------------------------------
@vd_drag_text_bp.route("/add", methods=["POST"])
def add_vd_drag_activity():
    try:
        instruction = request.form.get("instruction")
        level       = request.form.get("level", "EASY")
        targets     = request.form.getlist("targets")
        groups      = request.form.getlist("groups")
        marks       = request.form.getlist("marks")
        images      = request.files.getlist("images")

        if not instruction or not targets:
            return jsonify({"error": "Instruction and targets are required"}), 400
        if not images or images[0].filename == "":
            return jsonify({"error": "At least one image is required"}), 400
        if len(images) != len(groups) or len(images) != len(marks):
            return jsonify({"error": "Images, groups, and marks count must match"}), 400

        os.makedirs(current_app.config["VD_UPLOAD_FOLDER"], exist_ok=True)

        items = []
        for i, img in enumerate(images):
            filename    = secure_filename(img.filename)
            unique_name = f"{datetime.utcnow().strftime('%Y%m%d%H%M%S%f')}_{i}_{filename}"
            filepath    = os.path.join(current_app.config["VD_UPLOAD_FOLDER"], unique_name)
            img.save(filepath)
            items.append(vd_drag_item_schema(
                image_url = f"/vd_uploads/{unique_name}",
                group     = groups[i],
                mark      = marks[i]
            ))

        record = vd_drag_text_schema(instruction, level, targets, items)
        result = mongo.db.vd_drag_text.insert_one(record)
        return jsonify({"message": "Activity added successfully", "id": str(result.inserted_id)}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------------------------------
# GET /api/vd_drag_text/all
# Get all activities (admin manage page)
# -------------------------------------------------------
@vd_drag_text_bp.route("/all", methods=["GET"])
def get_all_activities():
    try:
        activities = list(mongo.db.vd_drag_text.find())
        for a in activities:
            a["_id"] = str(a["_id"])
        return jsonify(activities), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------------------------------
# GET /api/vd_drag_text/level/<level>
# Get activities by level (user side)
# -------------------------------------------------------
@vd_drag_text_bp.route("/level/<level>", methods=["GET"])
def get_by_level(level):
    try:
        activities = list(mongo.db.vd_drag_text.find({"level": level.upper()}))
        for a in activities:
            a["_id"] = str(a["_id"])
        return jsonify(activities), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------------------------------
# PUT /api/vd_drag_text/update/<id>
# Update an activity (admin manage page)
# -------------------------------------------------------
@vd_drag_text_bp.route("/update/<id>", methods=["PUT"])
def update_activity(id):
    try:
        instruction = request.form.get("instruction")
        level       = request.form.get("level", "EASY")
        targets     = request.form.getlist("targets")

        if not instruction or not targets:
            return jsonify({"error": "Instruction and targets are required"}), 400

        update_fields = {
            "instruction": instruction,
            "level":       level.upper(),
            "targets":     targets,
        }

        # Only replace images if new ones are uploaded
        images = request.files.getlist("images")
        if images and images[0].filename != "":
            groups = request.form.getlist("groups")
            marks  = request.form.getlist("marks")

            if len(images) != len(groups) or len(images) != len(marks):
                return jsonify({"error": "Images, groups, and marks count must match"}), 400

            os.makedirs(current_app.config["VD_UPLOAD_FOLDER"], exist_ok=True)
            items = []
            for i, img in enumerate(images):
                filename    = secure_filename(img.filename)
                unique_name = f"{datetime.utcnow().strftime('%Y%m%d%H%M%S%f')}_{i}_{filename}"
                filepath    = os.path.join(current_app.config["VD_UPLOAD_FOLDER"], unique_name)
                img.save(filepath)
                items.append(vd_drag_item_schema(
                    image_url = f"/vd_uploads/{unique_name}",
                    group     = groups[i],
                    mark      = marks[i]
                ))
            update_fields["items"] = items

        mongo.db.vd_drag_text.update_one(
            {"_id": ObjectId(id)},
            {"$set": update_fields}
        )
        return jsonify({"message": "Activity updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------------------------------
# DELETE /api/vd_drag_text/delete/<id>
# Delete an activity (admin manage page)
# -------------------------------------------------------
@vd_drag_text_bp.route("/delete/<id>", methods=["DELETE"])
def delete_activity(id):
    try:
        result = mongo.db.vd_drag_text.delete_one({"_id": ObjectId(id)})
        if result.deleted_count == 0:
            return jsonify({"error": "Activity not found"}), 404
        return jsonify({"message": "Activity deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


