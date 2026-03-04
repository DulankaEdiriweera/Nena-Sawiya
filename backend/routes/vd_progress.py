from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db import mongo
from bson import ObjectId

vd_progress_bp = Blueprint("vd_progress_bp", __name__)

level_map = {
    "දුර්වල": "Weak",
    "සාමාන්‍ය": "Normal",
    "ඉතා හොඳයි": "High"
}

MAX_SCORE = 50


def get_total(doc):
    """Extract total score from doc - checks direct field and inside input_marks."""
    # Try direct fields first
    for field in ["Total", "total", "total_score", "TotalScore", "score"]:
        val = doc.get(field)
        if val is not None:
            try:
                return float(val)
            except (TypeError, ValueError):
                continue

    # Try inside input_marks (dict or nested object)
    input_marks = doc.get("input_marks")
    if input_marks:
        if isinstance(input_marks, dict):
            for field in ["Total", "total", "total_score", "TotalScore", "score",
                          "Total Marks", "total_marks"]:
                val = input_marks.get(field)
                if val is not None:
                    try:
                        return float(val)
                    except (TypeError, ValueError):
                        continue
            # If no named total found, sum all numeric values inside input_marks
            total = 0
            for v in input_marks.values():
                try:
                    total += float(v)
                except (TypeError, ValueError):
                    continue
            if total > 0:
                return total

        # input_marks might be a number itself
        try:
            return float(input_marks)
        except (TypeError, ValueError):
            pass

    return 0


@vd_progress_bp.route("/latest_vd_progress", methods=["GET"])
@jwt_required()
def get_latest_vd_progress():
    user_id = get_jwt_identity()

    query_ids = [user_id]
    try:
        query_ids.append(ObjectId(user_id))
    except Exception:
        pass

    collection = mongo.db.vd_assessments

    assessments = []
    for field in ["user_id", "userId", "user"]:
        assessments = list(
            collection
            .find({field: {"$in": query_ids}})
            .sort("_id", -1)
            .limit(2)
        )
        if assessments:
            break

    print(f"[VD Progress] found={len(assessments)}")
    if assessments:
        print(f"[VD Progress] input_marks={assessments[0].get('input_marks')}")

    if len(assessments) < 2:
        if len(assessments) == 1:
            latest = previous = assessments[0]
        else:
            return jsonify({
                "previous_percentage": 0,
                "latest_percentage": 0,
                "percentage_change": 0,
                "previous_level": "N/A",
                "latest_level": "N/A",
                "previous_date": None,
                "latest_date": None
            }), 200
    else:
        latest = assessments[0]
        previous = assessments[1]

    latest_total = get_total(latest)
    previous_total = get_total(previous)

    print(f"[VD Progress] latest_total={latest_total}, previous_total={previous_total}")

    latest_score_percent = round((latest_total / MAX_SCORE) * 100, 2)
    previous_score_percent = round((previous_total / MAX_SCORE) * 100, 2)
    percentage_change = round(latest_score_percent - previous_score_percent, 2)

    previous_level = level_map.get(previous.get("predicted_level"), previous.get("predicted_level", "N/A"))
    latest_level = level_map.get(latest.get("predicted_level"), latest.get("predicted_level", "N/A"))

    def get_date(doc):
        date_val = doc.get("created_at")
        if date_val:
            return str(date_val)
        try:
            return str(doc["_id"].generation_time)
        except Exception:
            return None

    return jsonify({
        "previous_percentage": previous_score_percent,
        "latest_percentage": latest_score_percent,
        "percentage_change": percentage_change,
        "previous_level": previous_level,
        "latest_level": latest_level,
        "previous_date": get_date(previous),
        "latest_date": get_date(latest)
    }), 200