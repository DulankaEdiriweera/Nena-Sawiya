from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db import mongo

vc_progress_bp = Blueprint("vc_progress_bp", __name__)

@vc_progress_bp.route("/latest_progress", methods=["GET"])
@jwt_required()
def get_latest_vc_progress():
    user_id = get_jwt_identity()

    # Get last 2 VC assessments for this user
    assessments = list(
        mongo.db.vc_assessments
        .find({"user_id": user_id})
        .sort("created_at", -1)   # newest first
        .limit(2)
    )

    if len(assessments) < 2:
        return jsonify({
            "message": "Not enough assessments to calculate progress"
        }), 400

    latest = assessments[0]
    previous = assessments[1]

    latest_percent = float(latest.get("final_marks_percent", 0))
    previous_percent = float(previous.get("final_marks_percent", 0))

    percentage_change = round(latest_percent - previous_percent, 2)

    return jsonify({
        "previous_percentage": round(previous_percent, 2),
        "latest_percentage": round(latest_percent, 2),
        "percentage_change": percentage_change,

        # You can show either rule-based or ML level (I include both)
        "previous_rule_level": previous.get("rule_based_label"),
        "latest_rule_level": latest.get("rule_based_label"),

        "previous_ml_level_en": previous.get("ml_label_en"),
        "latest_ml_level_en": latest.get("ml_label_en"),

        "previous_vc_level_si": previous.get("vc_level"),
        "latest_vc_level_si": latest.get("vc_level"),

        "previous_date": previous.get("created_at"),
        "latest_date": latest.get("created_at")
    }), 200