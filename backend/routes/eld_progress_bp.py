from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db import mongo

eld_progress_bp = Blueprint("eld_progress_bp", __name__)

# -------------------------------
# Progress Checking Route
# -------------------------------

@eld_progress_bp.route("/latest_progress", methods=["GET"])
@jwt_required()
def get_latest_progress():

    user_id = get_jwt_identity()

    # Fetch only this user's last 2 assessments (optimized)
    assessments = list(
        mongo.db.eld_assessments
        .find({"user_id": user_id})
        .sort("created_at", -1)  # newest first
        .limit(2)
    )

    if len(assessments) < 2:
        return jsonify({
            "message": "Not enough assessments to calculate progress"
        }), 400

    latest = assessments[0]
    previous = assessments[1]

    percentage_change = round(
        latest["overall_percentage"] - previous["overall_percentage"], 2
    )

    return jsonify({
        "previous_percentage": previous["overall_percentage"],
        "latest_percentage": latest["overall_percentage"],
        "percentage_change": percentage_change,
        "previous_level": previous["eld_level"],
        "latest_level": latest["eld_level"],
        "previous_date": previous["created_at"],
        "latest_date": latest["created_at"]
    }), 200