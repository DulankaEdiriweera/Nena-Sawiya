from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db import mongo

vd_levels_bp = Blueprint("vd_levels_bp", __name__)

# Map predicted levels → suggested levels
LEVEL_MAP = {
    "දුර්වල": ["EASY"],                # Weak student: EASY recommended
    "සාමාන්‍ය": ["MEDIUM", "HARD"],     # Normal student: MEDIUM recommended
    "ඉතා හොඳයි": ["MEDIUM", "HARD"]   # High student: HARD recommended
}

# Recommended starting level
RECOMMEND_MAP = {
    "දුර්වල": "EASY",
    "සාමාන්‍ය": "MEDIUM",
    "ඉතා හොඳයි": "HARD"
}

# ✅ 1. GET LEVELS
@vd_levels_bp.route("/", methods=["GET"])
@jwt_required()
def get_vd_levels():
    """
    Returns the student's predicted level, unlocked levels,
    and recommended starting level.
    """
    user_id = get_jwt_identity()

    latest = mongo.db.vd_assessments.find_one(
        {"user_id": user_id}, sort=[("_id", -1)]
    )

    if not latest:
        return jsonify({"error": "No assessment found"}), 404

    predicted_level = latest.get("predicted_level", "දුර්වල")
    unlocked_levels = LEVEL_MAP.get(predicted_level, ["EASY"])
    recommended_level = RECOMMEND_MAP.get(predicted_level, "EASY")

    return jsonify({
        "predicted_level": predicted_level,
        "available_levels": unlocked_levels,
        "recommended_level": recommended_level
    })

# ✅ 2. SELECT LEVEL (Optional override)
@vd_levels_bp.route("/select_level", methods=["POST"])
@jwt_required()
def select_level():
    """
    Allows student to select any level.
    If the level is not the recommended one, returns a warning.
    """
    user_id = get_jwt_identity()
    data = request.json
    selected_level = data.get("level")

    latest = mongo.db.vd_assessments.find_one(
        {"user_id": user_id}, sort=[("_id", -1)]
    )

    if not latest:
        return jsonify({"error": "No assessment found"}), 404

    predicted_level = latest.get("predicted_level", "දුර්වල")
    recommended_level = RECOMMEND_MAP.get(predicted_level, "EASY")
    unlocked_levels = LEVEL_MAP.get(predicted_level, ["EASY"])

    warning = None
    if selected_level not in unlocked_levels or selected_level != recommended_level:
        warning = f"⚠️ {recommended_level} is the recommended starting level. You can still continue with {selected_level} if you want."

    # Save current level selection
    mongo.db.vd_assessments.update_one(
        {"_id": latest["_id"]},
        {"$set": {"current_level": selected_level}}
    )

    return jsonify({
        "selected_level": selected_level,
        "recommended_level": recommended_level,
        "warning": warning
    })

# ✅ 3. UNLOCK NEXT LEVEL
@vd_levels_bp.route("/unlock_next", methods=["POST"])
@jwt_required()
def unlock_next_level():
    """
    Unlocks next level based on current unlocked_levels.
    """
    user_id = get_jwt_identity()
    data = request.json
    completed_level = data.get("level")

    latest = mongo.db.vd_assessments.find_one(
        {"user_id": user_id}, sort=[("_id", -1)]
    )

    if not latest:
        return jsonify({"error": "No assessment found"}), 404

    predicted_level = latest.get("predicted_level", "දුර්වල")
    unlocked_levels = LEVEL_MAP.get(predicted_level, ["EASY"])

    try:
        idx = unlocked_levels.index(completed_level)
        if idx + 1 < len(unlocked_levels):
            next_level = unlocked_levels[idx + 1]

            mongo.db.vd_assessments.update_one(
                {"_id": latest["_id"]},
                {"$set": {"current_level": next_level}}
            )

            return jsonify({"next_level": next_level})

    except ValueError:
        pass

    return jsonify({"message": "No next level"})