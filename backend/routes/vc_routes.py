from flask import Blueprint, request, jsonify
from database.db import mongo
from models.vc_model import VCModel

import os
import json
import joblib
import numpy as np
import pandas as pd

vc_bp = Blueprint("vc_bp", __name__)

# -------------------------------
# Load ML artifacts
# -------------------------------
VC_MODEL_DIR = "vc_models"

vc_model = joblib.load(os.path.join(VC_MODEL_DIR, "visual_closure_model.pkl"))
vc_label_encoder = joblib.load(os.path.join(VC_MODEL_DIR, "label_encoder.pkl"))

with open(os.path.join(VC_MODEL_DIR, "feature_columns.json")) as f:
    vc_feature_columns = json.load(f)

with open(os.path.join(VC_MODEL_DIR, "answer_key.json")) as f:
    ANSWER_KEY = json.load(f)

TIME_COLS = ["Time Taken sec(level1)", "Time Taken sec(level2)", "Time Taken sec(level3)"]

# Sinhala Feedback Mapping
vc_feedback_map = {
    "Weak": "දෘශ්‍ය සම්පූර්ණතා හැකියාව දුර්වලයි. අතිරේක පුහුණුව අවශ්‍ය වේ.",
    "Average": "දෘශ්‍ය සම්පූර්ණතා හැකියාව සාමාන්‍ය මට්ටමින් පවතී.",
    "High": "දෘශ්‍ය සම්පූර්ණතා හැකියාව ඉතා හොඳයි."
}

# Sinhala Level Mapping
vc_level_sinhala_map = {
    "Weak": "දුර්වල",
    "Average": "සාමාන්‍ය",
    "High": "ඉතා හොදයි"
}

# -------------------------------
# Helper: build features for ML
# -------------------------------
def build_features_from_input(payload: dict) -> pd.DataFrame:
    X = {}

    # correctness per question
    for q, correct_opt in ANSWER_KEY.items():
        given = payload.get(q, None)
        try:
            given = int(float(given))
        except Exception:
            given = -999
        X[f"{q}_correct"] = 1 if given == int(correct_opt) else 0

    # time features
    for tcol in TIME_COLS:
        try:
            X[tcol] = float(payload.get(tcol, 0))
        except Exception:
            X[tcol] = 0.0

    # aggregates
    X["level1_correct"] = X["Q1_correct"] + X["Q2_correct"] + X["Q3_correct"]
    X["level2_correct"] = X["Q4_correct"] + X["Q5_correct"] + X["Q6_correct"]
    X["level3_correct"] = X["Q7_correct"] + X["Q8_correct"] + X["Q9_correct"] + X["Q10_correct"]
    X["total_correct"] = sum(X[k] for k in X if k.endswith("_correct"))

    X["level1_fast"] = 1 if X["Time Taken sec(level1)"] <= 20 else 0
    X["level2_fast"] = 1 if X["Time Taken sec(level2)"] <= 20 else 0
    X["level3_fast"] = 1 if X["Time Taken sec(level3)"] <= 20 else 0

    df = pd.DataFrame([X])

    # ensure correct column order
    for col in vc_feature_columns:
        if col not in df.columns:
            df[col] = 0
    df = df[vc_feature_columns]
    return df

# -------------------------------
# Helper: compute marks (rule-based)
# -------------------------------
def compute_marks(payload: dict):
    def ans(q):
        try:
            return int(float(payload.get(q, -999)))
        except Exception:
            return -999

    def t(name):
        try:
            return float(payload.get(name, 0))
        except Exception:
            return 0.0

    c = {}
    for q, correct_opt in ANSWER_KEY.items():
        c[q] = 1 if ans(q) == int(correct_opt) else 0

    # Level 1
    l1_marks = c["Q1"] + c["Q2"] + c["Q3"]
    if t("Time Taken sec(level1)") <= 20 and (c["Q1"] + c["Q2"] + c["Q3"]) >= 1:
        l1_marks += 2
    l1_marks = min(l1_marks, 5)

    # Level 2
    l2_marks = c["Q4"] * 2 + c["Q5"] * 2 + c["Q6"] * 3
    if t("Time Taken sec(level2)") <= 20 and (c["Q4"] + c["Q5"] + c["Q6"]) >= 1:
        l2_marks += 3
    l2_marks = min(l2_marks, 10)

    # Level 3
    l3_marks = (c["Q7"] + c["Q8"] + c["Q9"] + c["Q10"]) * 2
    if t("Time Taken sec(level3)") <= 20 and (c["Q7"] + c["Q8"] + c["Q9"] + c["Q10"]) >= 1:
        l3_marks += 2
    l3_marks = min(l3_marks, 10)

    total = l1_marks + l2_marks + l3_marks
    final_percent = round((total / 25) * 100, 2)

    if final_percent >= 80:
        rule_label = "High"
    elif final_percent >= 60:
        rule_label = "Average"
    else:
        rule_label = "Weak"

    return {
        "marks_level1": int(l1_marks),
        "marks_level2": int(l2_marks),
        "marks_level3": int(l3_marks),
        "total_marks": int(total),
        "final_marks_percent": final_percent,
        "rule_based_label": rule_label
    }

# -------------------------------
# Helper: ML prediction
# -------------------------------
def predict_vc(payload: dict):
    X_new = build_features_from_input(payload)

    proba = vc_model.predict_proba(X_new)[0]
    pred_idx = int(np.argmax(proba))
    confidence = float(np.max(proba))

    level_en = vc_label_encoder.inverse_transform([pred_idx])[0]
    level_si = vc_level_sinhala_map.get(level_en, level_en)
    feedback = vc_feedback_map.get(level_en, "ප්‍රතිචාර ලබා දීමට නොහැකි විය.")

    return {
        "ml_label_en": level_en,
        "VC_Level": level_si,
        "Confidence": round(confidence * 100, 2),
        "Feedback": feedback
    }

# -------------------------------
# Route: predict + store
# -------------------------------
@vc_bp.route("/predict_vc", methods=["POST"])
def predict_vc_route():
    payload = request.get_json(force=True)

    ml_result = predict_vc(payload)
    marks_result = compute_marks(payload)

    mismatch = (ml_result["ml_label_en"] != marks_result["rule_based_label"])

    # Extract answers and times to store nicely
    answers = {q: payload.get(q) for q in ANSWER_KEY.keys()}
    times = {t: payload.get(t, 0) for t in TIME_COLS}

    vc_record = VCModel(
        answers=answers,
        times=times,

        ml_label_en=ml_result["ml_label_en"],
        vc_level_si=ml_result["VC_Level"],
        confidence=float(ml_result["Confidence"]),
        feedback=ml_result["Feedback"],

        marks_level1=marks_result["marks_level1"],
        marks_level2=marks_result["marks_level2"],
        marks_level3=marks_result["marks_level3"],
        total_marks=marks_result["total_marks"],
        final_marks_percent=float(marks_result["final_marks_percent"]),
        rule_based_label=marks_result["rule_based_label"],
        ml_vs_rule_mismatch=bool(mismatch)
    )

    mongo.db.vc_assessments.insert_one(vc_record.to_dict())

    return jsonify({
        **ml_result,
        **marks_result,
        "ml_vs_rule_mismatch": mismatch
    })

# -------------------------------
# Route: latest progress 
# -------------------------------
@vc_bp.route("/vc_latest_progress", methods=["GET"])
def vc_latest_progress():
    assessments = list(
        mongo.db.vc_assessments
        .find()
        .sort("created_at", 1)
    )

    if len(assessments) < 2:
        return jsonify({"message": "Not enough assessments to calculate progress"})

    previous = assessments[-2]
    latest = assessments[-1]

    percent_change = round(latest["final_marks_percent"] - previous["final_marks_percent"], 2)

    return jsonify({
        "previous_percent": previous["final_marks_percent"],
        "latest_percent": latest["final_marks_percent"],
        "percent_change": percent_change,
        "previous_level": previous["vc_level"],
        "latest_level": latest["vc_level"],
        "previous_date": previous["created_at"],
        "latest_date": latest["created_at"]
    })