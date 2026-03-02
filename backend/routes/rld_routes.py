from flask import Blueprint, request, jsonify
from database.db import mongo
from models.rld_model import RLDModel
import joblib
import os
from scipy.sparse import hstack
from flask_jwt_extended import jwt_required, get_jwt_identity

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
    "Weak": (
        "දරුවාගේ ප්‍රතිග්‍රාහක භාෂා කුසලතා දුර්වල මට්ටමක පවතී. "
        "ශ්‍රවණය කිරීමේදී සහ ලබා දෙන නිර්දේශ අවබෝධ කර ගැනීමේ දුෂ්කරතා ඇති බව පෙනේ. "
        "දෙමව්පියන් දිනපතා දරුවා සමඟ සරල, කෙටි වාක්‍ය භාවිතා කරමින් ස්වාභාවිකව කතා කළ යුතු අතර, "
        "හැකි ඉක්මනින් භාෂා චිකිත්සකයෙකු හෝ විශේෂ අධ්‍යාපන විශේෂඥයෙකු සමඟ දරුවා යොමු කිරීම නිර්දේශ කෙරේ."
    ),
    "Average": (
        "දරුවාගේ ප්‍රතිග්‍රාහක භාෂා කුසලතා සාමාන්‍ය මට්ටමක පවතී. "
        "සරල ප්‍රශ්නවලට ප්‍රතිචාර දැක්වීමේ හැකියාව ඇති නමුත්, සංකීර්ණ නිර්දේශ "
        "සහ බහු-පියවර උපදෙස් අවබෝධ කර ගැනීම තවදුරටත් වර්ධනය කළ යුතුය. "
        "දිනපතා ස්වාභාවික සිංහල සංවාද, කෙටි කතාන්දර ශ්‍රවණය, සහ ප්‍රශ්නෝත්තර "
        "ව්‍යායාම හරහා ශ්‍රවණ කුසලතා ඉහළ නැංවීම ගෙදර සහ පාසලේ දෙඅංශයෙන්ම සිදු කළ යුතුය."
    ),
    "Normal": (
        "දරුවාගේ ප්‍රතිග්‍රාහක භාෂා කුසලතා සෞඛ්‍ය සම්පන්න මට්ටමක පවතී. "
        "ලබා දෙන ප්‍රශ්නවලට නිවැරදිව, ස්වාධීනව, සහ ස්ව-විශ්වාසයෙන් ප්‍රතිචාර දක්වයි. "
        "දරුවාගේ ශ්‍රේෂ්ඨ ශ්‍රවණ කුසලතා ප්‍රශංසා කළ යුතු අතර, කියවීම, "
        "ශ්‍රව්‍ය-දෘශ්‍ය ද්‍රව්‍ය, සහ දිනපතා ස්වාභාවික සංවාද හරහා "
        "මෙම ශ්‍රේෂ්ඨ මට්ටම නිරන්තරයෙන් පවත්වා ගත යුතුය."
    )
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
@jwt_required()
def predict_rld():
    data = request.get_json()
    user_id = get_jwt_identity()

    percentage, level, feedback = predict_new_rld(data)

    # Create model object
    rld_record = RLDModel(
        user_id,
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