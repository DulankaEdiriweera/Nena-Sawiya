import os, json
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from bson import ObjectId
from database.db import mongo
from models.vd_count_image_model import vd_count_game_schema, vd_count_item_schema

vd_count_bp = Blueprint("vd_count_bp", __name__)

def serialize(doc):
    doc["_id"] = str(doc["_id"])
    if "created_at" in doc:
        doc["created_at"] = str(doc["created_at"])
    return doc

# ── ADD GAME ──────────────────────────────────────────────
@vd_count_bp.route("/add", methods=["POST"])
def add_game():
    title         = request.form.get("title")
    level         = request.form.get("level")
    question_img  = request.files.get("question_image")
    items_json    = request.form.get("items")

    if not all([title, level, question_img, items_json]):
        return jsonify({"error": "Missing fields"}), 400

    items_data = json.loads(items_json)

    q_filename = secure_filename(question_img.filename)
    q_path = os.path.join(current_app.config["VD_UPLOAD_FOLDER"], q_filename)
    question_img.save(q_path)

    # Handle per-item uploaded images
    items = []
    for idx, item in enumerate(items_data):
        item_img = request.files.get(f"item_image_{idx}")
        if item_img:
            i_filename = secure_filename(item_img.filename)
            i_path = os.path.join(current_app.config["VD_UPLOAD_FOLDER"], i_filename)
            item_img.save(i_path)
            image_url = f"/vd_uploads/{i_filename}"
        else:
            image_url = item.get("image_url", "")

        items.append(vd_count_item_schema(
            item["label"],
            image_url,
            item["correct_answer"],
            item.get("mark", 1)
        ))

    record = vd_count_game_schema(title, level, f"/vd_uploads/{q_filename}", items)
    mongo.db.vd_count_games.insert_one(record)
    return jsonify({"message": "ක්‍රීඩාව සාර්ථකව එකතු කරන ලදී"}), 201


# ── GET ALL (ADMIN) ────────────────────────────────────────
@vd_count_bp.route("/all", methods=["GET"])
def get_all():
    data = [serialize(d) for d in mongo.db.vd_count_games.find()]
    return jsonify(data)


# ── GET BY LEVEL (USER) ────────────────────────────────────
@vd_count_bp.route("/level/<level>", methods=["GET"])
def get_by_level(level):
    data = [serialize(d) for d in mongo.db.vd_count_games.find({"level": level.upper()})]
    return jsonify(data)


# ── DELETE ─────────────────────────────────────────────────
@vd_count_bp.route("/delete/<game_id>", methods=["DELETE"])
def delete_game(game_id):
    mongo.db.vd_count_games.delete_one({"_id": ObjectId(game_id)})
    return jsonify({"message": "ක්‍රීඩාව මකා දමන ලදී"})


# ── UPDATE ─────────────────────────────────────────────────
@vd_count_bp.route("/update/<game_id>", methods=["PUT"])
def update_game(game_id):
    data = request.json
    data.pop("_id", None)
    data.pop("created_at", None)
    mongo.db.vd_count_games.update_one(
        {"_id": ObjectId(game_id)},
        {"$set": data}
    )
    return jsonify({"message": "ක්‍රීඩාව යාවත්කාලීන කරන ලදී"})

