from flask import Blueprint, request, jsonify
from database.db import mongo
from models.rld_model import RLDModel
import joblib
import os
from scipy.sparse import hstack

rld_bp = Blueprint("rld_bp", __name__)

# ==============================
# Load ML Models
# ==============================

folder_path = "rld_models"

regressor_rld = joblib.load(os.path.join(folder_path, "rld_ridge_percentage_model.pkl"))
classifier_rld = joblib.load(os.path.join(folder_path, "rld_rf_level_model.pkl"))
vectorizers_rld = joblib.load(os.path.join(folder_path, "rld_vectorizers.pkl"))

question_cols_rld = [
    "Q1_i","Q1_ii","Q1_iii","Q1_iv",
    "Q2_i","Q2_ii","Q3_i","Q3_ii",
    "Q4","Q5_i","Q5_ii","Q5_iii",
    "Q6_i","Q6_ii","Q7"
]

feedback_map_rld = {
   "Weak": "දරුවාගේ ප්‍රතිග්‍රාහක භාෂා කුසලතා අඩුයි. අඛණ්ඩ පුහුණු කිරීම අවශ්‍යයි.",
   "Average": "දරුවාගේ ප්‍රතිග්‍රාහක භාෂා කුසලතා සාමාන්‍ය මට්ටමක පවතී. වැඩිදියුණු කිරීමට මග පෙන්වීම් අවශ්‍යයි.",
   "Normal": "දරුවාගේ ප්‍රතිග්‍රාහක භාෂා කුසලතා සෞඛ්‍ය සම්පන්නයි. නිතර පුහුණු කිරීමෙන් තවත් ශක්තිමත් කළ හැක."
}

# ==============================
# Prediction Logic
# ==============================

def predict_new_rld(responses: dict):

    features_list = []

    for i, q in enumerate(question_cols_rld):
        text = responses.get(q, "")
        features = vectorizers_rld[i].transform([text])
        features_list.append(features)

    X_new = hstack(features_list)

    percentage = regressor_rld.predict(X_new)[0]
    level = classifier_rld.predict(X_new)[0]

    return round(float(percentage), 2), level, feedback_map_rld.get(level)


# ==============================
# Prediction Route
# ==============================

@rld_bp.route("/predict_rld", methods=["POST"])
def predict_rld():

    data = request.get_json()

    percentage, level, feedback = predict_new_rld(data)

    # Create model object
    rld_record = RLDModel(
        answers=data,
        overall_percentage=percentage,
        rld_level=level,
        feedback=feedback
    )

    # Save to MongoDB
    mongo.db.rld_assessments.insert_one(
        rld_record.to_dict()
    )

    # Return response matching frontend naming
    return jsonify({
        "Percentage": percentage,
        "RLD_level": level,
        "Feedback": feedback,
        "answers": data
    })


# ==============================
# Progress Checking Route
# ==============================

@rld_bp.route("/latest_progress_rld", methods=["GET"])
def get_latest_progress_rld():

    assessments = list(
        mongo.db.rld_assessments
        .find()
        .sort("created_at", 1)
    )

    if len(assessments) < 2:
        return jsonify({
            "message": "Not enough assessments to calculate progress"
        })

    previous = assessments[-2]
    latest = assessments[-1]

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
    })