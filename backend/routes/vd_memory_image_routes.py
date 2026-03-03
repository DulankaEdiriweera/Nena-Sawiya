import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from database.db import mongo
from datetime import datetime
from bson import ObjectId
import json

vd_memory_bp = Blueprint("vd_memory_bp", __name__)

def serialize(doc):
    """Convert MongoDB document to JSON-safe dict."""
    doc["_id"] = str(doc["_id"])
    return doc


# ---------------- ADD GAME ----------------
@vd_memory_bp.route("/add", methods=["POST"])
def add_game():
    try:
        title = request.form.get("title", "").strip()
        level = request.form.get("level", "EASY").upper()
        image = request.files.get("image")

        if not title:
            return jsonify({"error": "Title is required"}), 400
        if not image:
            return jsonify({"error": "No image uploaded"}), 400

        questions_json = request.form.get("questions")
        if not questions_json:
            return jsonify({"error": "No questions provided"}), 400

        try:
            questions = json.loads(questions_json)
        except json.JSONDecodeError:
            return jsonify({"error": "Questions are not valid JSON"}), 400

        if not isinstance(questions, list) or len(questions) == 0:
            return jsonify({"error": "Questions must be a non-empty list"}), 400

        # Validate each question
        for i, q in enumerate(questions):
            if not q.get("question", "").strip():
                return jsonify({"error": f"Question {i+1} text is missing"}), 400
            if not isinstance(q.get("options"), list) or len(q["options"]) < 2:
                return jsonify({"error": f"Question {i+1} must have at least 2 options"}), 400
            if not any(o.strip() for o in q["options"]):
                return jsonify({"error": f"Question {i+1} options cannot be empty"}), 400
            correct = int(q.get("correct", 0))
            if correct < 0 or correct >= len(q["options"]):
                return jsonify({"error": f"Question {i+1} correct index out of range"}), 400
            questions[i]["correct"] = correct
            questions[i]["mark"] = int(q.get("mark", 1))

        # Check for duplicate title
        existing = mongo.db.vd_memory_games.find_one({"title": title})
        if existing:
            return jsonify({"error": "A game with this title already exists"}), 409

        # Save image
        os.makedirs(current_app.config["VD_UPLOAD_FOLDER"], exist_ok=True)
        filename = secure_filename(image.filename)
        # Add timestamp to avoid collisions
        filename = f"{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{filename}"
        path = os.path.join(current_app.config["VD_UPLOAD_FOLDER"], filename)
        image.save(path)
        image_url = f"/vd_uploads/{filename}"

        mongo.db.vd_memory_games.insert_one({
            "title": title,
            "level": level,
            "image_url": image_url,
            "questions": questions,
            "created_at": datetime.utcnow()
        })

        return jsonify({"message": "Game added successfully!"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------- GET ALL GAMES ----------------
@vd_memory_bp.route("/all", methods=["GET"])
def get_all_games():
    try:
        games = list(mongo.db.vd_memory_games.find())
        return jsonify([serialize(g) for g in games])
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------- GET GAMES BY LEVEL ----------------
@vd_memory_bp.route("/level/<level>", methods=["GET"])
def get_games_by_level(level):
    try:
        games = list(mongo.db.vd_memory_games.find({"level": level.upper()}))
        return jsonify([serialize(g) for g in games])
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------- GET SINGLE GAME BY ID ----------------
@vd_memory_bp.route("/<game_id>", methods=["GET"])
def get_game(game_id):
    try:
        game = mongo.db.vd_memory_games.find_one({"_id": ObjectId(game_id)})
        if not game:
            return jsonify({"error": "Game not found"}), 404
        return jsonify(serialize(game))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------- UPDATE GAME BY ID ----------------
@vd_memory_bp.route("/update/<game_id>", methods=["PUT"])
def update_game(game_id):
    try:
        title = request.form.get("title", "").strip()
        level = request.form.get("level", "").upper()
        image = request.files.get("image")
        questions_json = request.form.get("questions")

        update_data = {}

        if title:
            update_data["title"] = title
        if level:
            update_data["level"] = level
        if questions_json:
            try:
                questions = json.loads(questions_json)
                for i, q in enumerate(questions):
                    questions[i]["correct"] = int(q.get("correct", 0))
                    questions[i]["mark"] = int(q.get("mark", 1))
                update_data["questions"] = questions
            except json.JSONDecodeError:
                return jsonify({"error": "Questions are not valid JSON"}), 400

        if image:
            os.makedirs(current_app.config["VD_UPLOAD_FOLDER"], exist_ok=True)
            filename = secure_filename(image.filename)
            filename = f"{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{filename}"
            path = os.path.join(current_app.config["VD_UPLOAD_FOLDER"], filename)
            image.save(path)
            update_data["image_url"] = f"/vd_uploads/{filename}"

        if not update_data:
            return jsonify({"error": "No data provided to update"}), 400

        result = mongo.db.vd_memory_games.update_one(
            {"_id": ObjectId(game_id)},
            {"$set": update_data}
        )
        if result.matched_count == 0:
            return jsonify({"error": "Game not found"}), 404

        return jsonify({"message": "Updated successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------- DELETE GAME BY ID ----------------
@vd_memory_bp.route("/delete/<game_id>", methods=["DELETE"])
def delete_game(game_id):
    try:
        result = mongo.db.vd_memory_games.delete_one({"_id": ObjectId(game_id)})
        if result.deleted_count == 0:
            return jsonify({"error": "Game not found"}), 404
        return jsonify({"message": "Deleted successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

