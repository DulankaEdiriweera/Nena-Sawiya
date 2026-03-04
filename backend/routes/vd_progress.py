from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db import mongo

vd_progress_bp = Blueprint("vd_progress_bp", __name__)

# Sinhala Level Mapping → readable levels
level_map = {
    "දුර්වල": "Weak",
    "සාමාන්‍ය": "Normal",
    "ඉතා හොඳයි": "High"
}

MAX_SCORE = 50  # your total marks

@vd_progress_bp.route("/latest_vd_progress", methods=["GET"])
@jwt_required()
def get_latest_vd_progress():
    user_id = get_jwt_identity()

    assessments = list(
        mongo.db.vd_assesment
        .find({"user_id": user_id})
        .sort("created_at", -1)
        .limit(2)
    )

    if len(assessments) < 2:
        return jsonify({
            "message": "Not enough assessments to calculate progress"
        }), 400

    latest = assessments[0]
    previous = assessments[1]

    # Scale scores to 100%
    latest_score_percent = round((latest["Total"] / MAX_SCORE) * 100, 2)
    previous_score_percent = round((previous["Total"] / MAX_SCORE) * 100, 2)

    # Improvement percentage
    if previous_score_percent != 0:
        improvement_value = round(((latest_score_percent - previous_score_percent) / previous_score_percent) * 100, 2)
    else:
        improvement_value = 0

    improvement_percentage = f"{improvement_value}%"

    previous_level = level_map.get(previous["predicted_level"], previous["predicted_level"])
    latest_level = level_map.get(latest["predicted_level"], latest["predicted_level"])

    return jsonify({
        "previous_score": previous_score_percent,
        "latest_score": latest_score_percent,
        "improvement_percentage": improvement_percentage,
        "previous_level": previous_level,
        "latest_level": latest_level
    }), 200