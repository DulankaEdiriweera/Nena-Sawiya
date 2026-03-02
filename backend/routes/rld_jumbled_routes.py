# routes/rld_jumbled_routes.py
import random
from flask import Blueprint, request, jsonify
from database.db import mongo
from bson.objectid import ObjectId
from flask_cors import cross_origin

rld_jumbled_bp = Blueprint("rld_jumbled_bp", __name__)

@rld_jumbled_bp.after_request
def add_cors(response):
    response.headers["Access-Control-Allow-Origin"]  = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    return response

MIN_WORDS = { "easy": 2, "medium": 3, "hard": 5 }
MAX_WORDS = { "easy": 3, "medium": 4, "hard": 5 }


# POST /api/rld_jumbled/add_jumbled_set
@rld_jumbled_bp.route("/add_jumbled_set", methods=["POST", "OPTIONS"])
@cross_origin()
def add_jumbled_set():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    data          = request.get_json()
    level         = data.get("level")
    jumbled_words = data.get("jumbled_words")
    correct_words = data.get("correct_words")

    if not level or not jumbled_words or not correct_words:
        return jsonify({"error": "Missing fields"}), 400

    min_w = MIN_WORDS.get(level, 2)
    max_w = MAX_WORDS.get(level, 5)

    if len(jumbled_words) < min_w:
        return jsonify({"error": f"{level} needs at least {min_w} words"}), 400
    if len(jumbled_words) > max_w:
        return jsonify({"error": f"{level} allows max {max_w} words"}), 400
    if sorted(jumbled_words) != sorted(correct_words):
        return jsonify({"error": "Jumbled and correct words must be the same words"}), 400

    mongo.db.rld_jumbled_sets.insert_one({
        "level":         level,
        "jumbled_words": jumbled_words,
        "correct_words": correct_words,
    })
    return jsonify({"message": "Jumbled sentence added successfully!"})


# GET /api/rld_jumbled/get_jumbled/<level>?seen=id1,id2,id3
# ✅ Excludes ALL seen IDs so same student never gets a repeat in one session

@rld_jumbled_bp.route("/get_jumbled/<level>", methods=["GET", "OPTIONS"])
@cross_origin()
def get_jumbled(level):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    # seen = comma-separated list of already-shown set IDs
    seen_param = request.args.get("seen", "")
    seen_ids   = [s.strip() for s in seen_param.split(",") if s.strip()]

    all_sets = list(mongo.db.rld_jumbled_sets.find({"level": level}))
    if not all_sets:
        return jsonify({"error": "No sets found"}), 404

    # Filter out everything the student has already seen
    unseen = [s for s in all_sets if str(s["_id"]) not in seen_ids]

    if not unseen:
        # Student has seen all questions — reset and start over
        unseen = all_sets

    s = random.choice(unseen)
    return jsonify({
        "_id":           str(s["_id"]),
        "jumbled_words": s["jumbled_words"],
        "drag_words":    s["jumbled_words"][:],
    })


# POST /api/rld_jumbled/check_jumbled
@rld_jumbled_bp.route("/check_jumbled", methods=["POST", "OPTIONS"])
@cross_origin()
def check_jumbled():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    data        = request.get_json()
    set_id      = data.get("set_id")
    user_answer = data.get("user_answer")

    record = mongo.db.rld_jumbled_sets.find_one({"_id": ObjectId(set_id)})
    if not record:
        return jsonify({"error": "Set not found"}), 404

    correct    = record["correct_words"]
    is_correct = user_answer == correct

    return jsonify({
        "correct":        is_correct,
        "correct_answer": correct,
    })

@rld_jumbled_bp.route("/admin_get_sets/<level>", methods=["GET", "OPTIONS"])
@cross_origin()
def admin_get_jumbled_sets(level):
    if request.method == "OPTIONS":
        return jsonify({}), 200
    sets = list(mongo.db.rld_jumbled_sets.find({"level": level}))
    results = []
    for s in sets:
        results.append({
            "_id":           str(s["_id"]),
            "level":         s["level"],
            "jumbled_words": s["jumbled_words"],
            "correct_words": s["correct_words"],
            "created_at":    str(s.get("created_at", "")),
        })
    return jsonify(results)

@rld_jumbled_bp.route("/delete_set/<set_id>", methods=["DELETE", "OPTIONS"])
@cross_origin(methods=["DELETE", "OPTIONS"])
def delete_jumbled_set(set_id):
    if request.method == "OPTIONS":
        return jsonify({}), 200
    result = mongo.db.rld_jumbled_sets.delete_one({"_id": ObjectId(set_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Not found"}), 404
    return jsonify({"message": "Deleted successfully"})

@rld_jumbled_bp.route("/update_set/<set_id>", methods=["PUT", "OPTIONS"])
@cross_origin()
def update_jumbled_set(set_id):
    if request.method == "OPTIONS":
        return jsonify({}), 200
    try:
        data          = request.get_json()
        level         = data.get("level")
        jumbled_words = data.get("jumbled_words")
        correct_words = data.get("correct_words")

        if jumbled_words and correct_words:
            if sorted(jumbled_words) != sorted(correct_words):
                return jsonify({"error": "Jumbled and correct words must be the same words"}), 400

        update_fields = {}
        if level:
            update_fields["level"] = level
        if jumbled_words:
            update_fields["jumbled_words"] = jumbled_words
        if correct_words:
            update_fields["correct_words"] = correct_words

        mongo.db.rld_jumbled_sets.update_one(
            {"_id": ObjectId(set_id)},
            {"$set": update_fields}
        )
        return jsonify({"message": "Jumbled set updated successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400
