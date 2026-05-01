from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db import mongo

vc_adaptive_bp = Blueprint("vc_adaptive_bp", __name__)

# -----------------------------
# TEMP MEMORY (SESSION-BASED)
# -----------------------------

user_progress_memory = {}


def get_token_key(user_id):
    auth_header = request.headers.get("Authorization", "")
    return f"{user_id}_{auth_header}"


# -----------------------------
# GET USER PROGRESS (PER ACTIVITY)
# -----------------------------
def get_user_progress(token_key, activity):
    if token_key not in user_progress_memory:
        user_progress_memory[token_key] = {}

    if activity not in user_progress_memory[token_key]:
        user_progress_memory[token_key][activity] = {
            "easy_done": 0,
            "medium_done": 0,
            "hard_done": 0
        }

    return user_progress_memory[token_key][activity]


# -----------------------------
# UPDATE PROGRESS
# -----------------------------
def update_progress(token_key, activity, level):
    prog = get_user_progress(token_key, activity)

    if level == "Weak":
        prog["easy_done"] += 1
    elif level == "Average":
        prog["medium_done"] += 1
    elif level == "High":
        prog["hard_done"] += 1

    user_progress_memory[token_key][activity] = prog
    return prog


# -----------------------------
# GET ADAPTIVE STATUS
# -----------------------------
@vc_adaptive_bp.route("/status", methods=["GET"])
@jwt_required()
def get_adaptive_status():
    user_id = get_jwt_identity()
    token_key = get_token_key(user_id)

    # IMPORTANT: activity param
    activity = request.args.get("activity")

    # Get latest assessment
    latest = mongo.db.vc_assessments.find_one(
        {"user_id": user_id},
        sort=[("created_at", -1)]
    )

    if not latest:
        return jsonify({"error": "No assessment found"}), 404

    ability = latest.get("ml_label_en")  # Weak / Average / High
    progress = get_user_progress(token_key, activity)

    unlocked = []

    # WEAK
    if ability == "Weak":
        unlocked.append("Weak")

        if progress["easy_done"] >= 3:
            unlocked.append("Average")

        if progress["medium_done"] >= 3:
            unlocked.append("High")

        recommended = "Weak"

    # AVERAGE
    elif ability == "Average":
        unlocked.extend(["Weak", "Average"])

        if progress["medium_done"] >= 3:
            unlocked.append("High")

        recommended = "Average"

    # HIGH
    elif ability == "High":
        unlocked.extend(["Weak", "Average", "High"])
        recommended = "High"

    return jsonify({
        "ability": ability,
        "recommended": recommended,
        "progress": progress,
        "unlocked_levels": unlocked
    })


# -----------------------------
# COMPLETE LEVEL
# -----------------------------
@vc_adaptive_bp.route("/complete/<activity>/<level>", methods=["POST"])
@jwt_required()
def complete_level(activity, level):
    user_id = get_jwt_identity()
    token_key = get_token_key(user_id)

    progress = update_progress(token_key, activity, level)

    return jsonify({
        "message": "Progress updated",
        "progress": progress
    })