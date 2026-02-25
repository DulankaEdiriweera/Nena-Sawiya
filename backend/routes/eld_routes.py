from flask import Blueprint, request, jsonify
from database.db import mongo
from models.eld_model import ELDModel
import joblib
from scipy.sparse import hstack
import os

eld_bp = Blueprint("eld_bp", __name__)

# -------------------------------
# Load ML Models
# -------------------------------
folder_path = "eld_models"
regressor_eld = joblib.load(os.path.join(folder_path,"percentage_model_eld.pkl"))
classifier_eld = joblib.load(os.path.join(folder_path,"eld_model_eld.pkl"))
vectorizers_eld = joblib.load(os.path.join(folder_path,"vectorizers_eld.pkl"))


# -------------------------------
# Sinhala Feedback Mapping
# -------------------------------
feedback_map_eld = {
    "Weak": "ඔබේ දරුවාගේ ප්‍රකාශන භාෂා කුසලතා දුර්වලතාවයේ සලකුණු පෙන්නුම් කරයි. වැඩි දුර නිරීක්ෂණය හා උපකාරය අවශ්‍ය වේ.",
    "Average": "ඔබේ දරුවාගේ ප්‍රකාශන භාෂා කුසලතා සාමාන්‍ය මට්ටමින් පවතින අතර වැඩි දියුණු කිරීම අවශ්‍ය විය හැක.",
    "Normal": "ඔබේ දරුවාගේ ප්‍රකාශන භාෂා කුසලතා සාමාන්‍යයෙන් සෞඛ්‍ය සම්පන්න ලෙස පවතී."
}

# -------------------------------
# Sinhala Level Mapping
# -------------------------------
eld_level_sinhala_map = {
    "Normal": "ඉතා හොදයි",
    "Average": "සාමාන්‍ය",
    "Weak": "දුර්වල"
}

# -------------------------------
# Prediction Function
# -------------------------------
def predict_new_eld(story1, story2, story3, story4):

    features_list = []

    for i, story in enumerate([story1, story2, story3, story4]):
        features = vectorizers_eld[i].transform([story])
        features_list.append(features)

    X_new = hstack(features_list)

    percentage = regressor_eld.predict(X_new)[0]
    level_en = classifier_eld.predict(X_new)[0]

    # Convert English level to Sinhala
    level_si = eld_level_sinhala_map.get(level_en, level_en)

    feedback = feedback_map_eld.get(level_en, "ප්‍රතිචාර ලබා දීමට නොහැකි විය.")

    return round(percentage, 2), level_en, level_si, feedback


# -------------------------------
# Prediction Route
# -------------------------------
@eld_bp.route("/predict_eld", methods=["POST"])
def predict_eld():

    data = request.get_json()

    story1 = data.get("story1", "")
    story2 = data.get("story2", "")
    story3 = data.get("story3", "")
    story4 = data.get("story4", "")

    percentage, level_en, level_si, feedback = predict_new_eld(
        story1, story2, story3, story4
    )

    # Save English level internally
    eld_record = ELDModel(
        story1,
        story2,
        story3,
        story4,
        percentage,
        level_si,
        feedback
    )

    # Save to MongoDB
    mongo.db.eld_assessments.insert_one(
        eld_record.to_dict()
    )

    return jsonify({
        "Overall_Percentage": percentage,
        "ELD_Level": level_si,   # Return Sinhala version
        "Feedback": feedback
    })


# -------------------------------
# Progress Checking Route
# -------------------------------
#progress checking
@eld_bp.route("/latest_progress", methods=["GET"])
def get_latest_progress():

    assessments = list(
        mongo.db.eld_assessments
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
    })