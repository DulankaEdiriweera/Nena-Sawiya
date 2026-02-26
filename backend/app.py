from flask import Flask, request, jsonify,send_from_directory
import os
import joblib
from scipy.sparse import hstack
from flask_cors import CORS
from database.db import init_db
import pandas as pd
from visualDiscrimination import preprocess_dataframe
import json
from datetime import datetime
import numpy as np
from routes.eld_routes import eld_bp
from routes.eld_storyClozeRoutes import story_bp
from routes.eld_picture_mcq_routes import picture_bp

# -------------------------------
# Flask App Setup
# -------------------------------
app = Flask(__name__)
CORS(app)  # allow all origins; for development only

# Initialize MongoDB
init_db(app)


# Configure uploads folder
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Register Blueprints
app.register_blueprint(eld_bp)
app.register_blueprint(picture_bp, url_prefix="/api/picture_mcq")
app.register_blueprint(story_bp, url_prefix="/api/story_bp")


# Serve uploaded audio files
@app.route('/uploads/<path:filename>')
def serve_audio(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)





# ---------- VD Model ----------
# Added at the END for safe integration
# -------------------------------

# Load VD model
vd_folder_path = "visualD_models"
VD_model = joblib.load(os.path.join(vd_folder_path, "VD_model.pkl"))

# Map numeric prediction to readable Sinhala labels
visual_D = {
    0: "දුර්වල",
    1: "සාමාන්‍ය",
    2: "ඉතා හොඳයි"
}

@app.route('/predictVDH', methods=['POST'])
def predict_vdh():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON received"}), 400

        # Convert JSON to DataFrame
        df = pd.DataFrame(data)

        # Ensure columns match the model's training columns
        expected_columns = VD_model.feature_names_in_
        missing_cols = [c for c in expected_columns if c not in df.columns]
        if missing_cols:
            return jsonify({"error": f"Missing columns: {missing_cols}"}), 400

        # Reorder and preprocess
        df = df[expected_columns]
        df = preprocess_dataframe(df, has_target=False)

        predictions = VD_model.predict(df)
        readable = [visual_D[p] for p in predictions]

        return jsonify({"predictions": readable})

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)}), 500







# =====================================================
# ======================= RLD =========================
# =====================================================
# Load RLD models
folder_path = "rld_models"
regressor_rld = joblib.load(os.path.join(folder_path,"rld_ridge_percentage_model.pkl"))
classifier_rld = joblib.load(os.path.join(folder_path,"rld_rf_level_model.pkl"))
vectorizers_rld = joblib.load(os.path.join(folder_path,"rld_vectorizers.pkl"))

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

def predict_new_rld(responses: dict):
    features = []
    for i, q in enumerate(question_cols_rld):
        text = responses.get(q, "")
        features.append(vectorizers_rld[i].transform([text]))
    X_new = hstack(features)

    percentage = regressor_rld.predict(X_new)[0]
    level = classifier_rld.predict(X_new)[0]

    return {
        "Overall_Percentage": round(float(percentage), 2),
        "RLD_Level": level,
        "Feedback": feedback_map_rld.get(level, "ප්‍රතිචාර ලබා දීමට නොහැකි විය.")
    }

@app.route("/predict_rld", methods=["POST"])
def predict_rld():
    data = request.get_json()
    prediction = predict_new_rld(data)
    return jsonify({
        "Percentage": prediction["Overall_Percentage"],   # matches React
        "RLD_level": prediction["RLD_Level"],             # matches React
        "Feedback": prediction["Feedback"],
        "answers": data                                   # return submitted answers
    })

# =========================================================
# ===================== VISUAL CLOSURE ====================
# =========================================================

VC_MODEL_DIR = "vc_models"

vc_model = joblib.load(os.path.join(VC_MODEL_DIR, "visual_closure_model.pkl"))
vc_label_encoder = joblib.load(os.path.join(VC_MODEL_DIR, "label_encoder.pkl"))

with open(os.path.join(VC_MODEL_DIR, "feature_columns.json")) as f:
    vc_feature_columns = json.load(f)

# -------------------------------
# VC Feedback Mapping
# -------------------------------
vc_feedback_map = {
    "Weak": "දෘශ්‍ය සම්පූර්ණතා හැකියාව දුර්වලයි. අතිරේක පුහුණුව අවශ්‍ය වේ.",
    "Average": "දෘශ්‍ය සම්පූර්ණතා හැකියාව සාමාන්‍ය මට්ටමින් පවතී.",
    "High": "දෘශ්‍ය සම්පූර්ණතා හැකියාව ඉතා හොඳයි."
}

vc_level_sinhala_map = {
    "Weak": "දුර්වල",
    "Average": "සාමාන්‍ය",
    "High": "ඉතා හොදයි"
}

# -------------------------------
# VC Prediction Function
# -------------------------------
def predict_new_vc(vc_input_data):
    """
    vc_input_data = {
        "Time Taken(level1)": 12,
        "marks(level1)": 5,
        ...
    }
    """

    # Create DataFrame with correct column order
    X_new = pd.DataFrame([vc_input_data])

    # Ensure all required features exist
    for col in vc_feature_columns:
        if col not in X_new:
            X_new[col] = 0

    X_new = X_new[vc_feature_columns]

    # Prediction
    pred_class = vc_model.predict(X_new)[0]
    pred_proba = vc_model.predict_proba(X_new).max()

    level_en = vc_label_encoder.inverse_transform([pred_class])[0]
    level_si = vc_level_sinhala_map.get(level_en, level_en)
    feedback = vc_feedback_map.get(level_en, "ප්‍රතිචාර ලබා දීමට නොහැකි විය.")

    return {
        "VC_Level": level_si,
        "Confidence": round(float(pred_proba) * 100, 2),
        "Feedback": feedback
    }

# -------------------------------
# VC Flask Route
# -------------------------------
@app.route("/predict_vc", methods=["POST"])
def predict_vc():
    data = request.get_json()
    result = predict_new_vc(data)
    return jsonify(result)


# -------------------------------
# Run Flask App
# -------------------------------
if __name__ == "__main__":
    app.run(debug=True)
