from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import CORS
from database.db import mongo

rld_progress_bp = Blueprint("rld_progress_bp", __name__)
CORS(rld_progress_bp)

# -------------------------------
# Progress Checking Route
# -------------------------------

@rld_progress_bp.route("/latest_rld_progress", methods=["GET"])
@jwt_required()
def get_latest_rld_progress():

    user_id = get_jwt_identity()

    assessments = list(
        mongo.db.rld_assessments
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

    percentage_change = round(
        latest["Percentage"] - previous["Percentage"], 2
    )

    return jsonify({
        "previous_percentage": previous["Percentage"],
        "latest_percentage": latest["Percentage"],
        "percentage_change": percentage_change,
        "previous_level": previous["RLD_level"],
        "latest_level": latest["RLD_level"],
        "previous_date": previous["created_at"],
        "latest_date": latest["created_at"]
    }), 200