from flask import Blueprint, request, jsonify
import os
import joblib
import pandas as pd
import hashlib
import json

from database.db import mongo
from models.vd_model import VDModel
from visualDiscrimination import preprocess_dataframe

vd_bp = Blueprint("vd_bp", __name__)

# -------------------------------
# Load VD Model
# -------------------------------
VD_MODEL_PATH = os.path.join("visualD_models", "VD_model.pkl")
VD_model = joblib.load(VD_MODEL_PATH)

# -------------------------------
# Sinhala Level Mapping
# -------------------------------
visual_D = {
    0: "දුර්වල",
    1: "සාමාන්‍ය",
    2: "ඉතා හොඳයි"
}

# -------------------------------
# Sinhala Advice Mapping
# -------------------------------
vd_feedback_map = {
    0: "ඔබේ දරුවාගේ දෘශ්‍ය පරතර හැකියාව දුර්වලයි. වැඩි මග පෙන්වීම හා පුහුණුව අවශ්‍ය වේ.",
    1: "ඔබේ දරුවාගේ දෘශ්‍ය පරතර හැකියාව සාමාන්‍ය මට්ටමක පවතියි. නිතර පුහුණුවෙන් වැඩි දියුණුවක් ලබා ගත හැක.",
    2: "ඔබේ දරුවාගේ දෘශ්‍ය පරතර හැකියාව ඉතා හොඳයි. නිතර පුහුණුව නංවූ වැඩිම දියුණුවක් ලබා ගත හැක."
}

# -------------------------------
# Helper: Compute wrong answer ratio
# -------------------------------
def compute_wrong_ratio(df: pd.DataFrame) -> pd.Series:
    total_features = df.shape[1]
    wrong_answers = (df <= 0).sum(axis=1)
    return wrong_answers / total_features

# -------------------------------
# Helper: Generate stable hash
# -------------------------------
def generate_assessment_hash(payload: dict) -> str:
    payload_str = json.dumps(payload, sort_keys=True)
    return hashlib.sha256(payload_str.encode()).hexdigest()

# -------------------------------
# Prediction Route
# -------------------------------
@vd_bp.route("/predictVDH", methods=["POST"])
@vd_bp.route("/predict_vd", methods=["POST"])
def predict_vd():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No JSON received"}), 400

        # Convert JSON → DataFrame
        df = pd.DataFrame(data)

        # Validate model features
        expected_columns = VD_model.feature_names_in_
        missing_cols = [c for c in expected_columns if c not in df.columns]
        if missing_cols:
            return jsonify({"error": f"Missing columns: {missing_cols}"}), 400

        # Reorder + preprocess
        df = df[expected_columns]
        df = preprocess_dataframe(df, has_target=False)

        total_score = int(df["Total"].iloc[0])
        input_payload = data[0] if isinstance(data, list) else data
        assessment_hash = generate_assessment_hash(input_payload)

        # -------------------------------
        # HARD RULE: Total ≤ 5
        # -------------------------------
        if total_score <= 5:
            level = visual_D[0]
            advice = vd_feedback_map[0]

            existing = mongo.db.vd_assessments.find_one({
                "assessment_hash": assessment_hash
            })

            if not existing:
                vd_record = VDModel(
                    input_marks=input_payload,
                    predicted_level=level,
                    advice=advice,
                    assessment_hash=assessment_hash
                )
                mongo.db.vd_assessments.insert_one(vd_record.to_dict())

            return jsonify({
                "VD_Level": level,
                "override_applied": True,
                "override_reason": "TOTAL_LE_5",
                "Advice": advice
            })

        # -------------------------------
        # ML Prediction + Wrong-ratio rule
        # -------------------------------
        wrong_ratio = compute_wrong_ratio(df)
        ml_predictions = VD_model.predict(df)

        final_predictions = []
        for i, pred in enumerate(ml_predictions):
            if wrong_ratio.iloc[i] >= 0.8:
                final_predictions.append(0)
            else:
                final_predictions.append(int(pred))

        level = visual_D[final_predictions[0]]
        advice = vd_feedback_map[final_predictions[0]]

        # -------------------------------
        # Save to DB (duplicate-safe)
        # -------------------------------
        existing = mongo.db.vd_assessments.find_one({
            "assessment_hash": assessment_hash
        })

        if not existing:
            vd_record = VDModel(
                input_marks=input_payload,
                predicted_level=level,
                advice=advice,
                assessment_hash=assessment_hash
            )
            mongo.db.vd_assessments.insert_one(vd_record.to_dict())

        return jsonify({
            "VD_Level": level,
            "override_applied": bool(wrong_ratio.iloc[0] >= 0.8),
            "Advice": advice
        })

    except Exception as e:
        print("❌ VD ERROR:", e)
        return jsonify({"error": str(e)}), 500