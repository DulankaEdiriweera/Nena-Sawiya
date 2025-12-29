from flask import Flask, request, jsonify
import os
import joblib
from scipy.sparse import hstack
from flask_cors import CORS
import pandas as pd
from visualDiscrimination import preprocess_dataframe

# -------------------------------
# Flask App Setup
# -------------------------------
app = Flask(__name__)
CORS(app)  # allow all origins; for development only

# -------------------------------
# ELD
# -------------------------------

# -------------------------------
# Load Saved Models and Vectorizers (ELD)
# -------------------------------
folder_path = "eld_models"
regressor_eld = joblib.load(os.path.join(folder_path,"percentage_model_eld.pkl"))
classifier_eld = joblib.load(os.path.join(folder_path,"eld_model_eld.pkl"))
vectorizers_eld = joblib.load(os.path.join(folder_path,"vectorizers_eld.pkl"))

# -------------------------------
# Feedback Mapping (ELD)
# -------------------------------
feedback_map_eld = {
    "Weak": "ඔබේ දරුවාගේ ප්‍රකාශන භාෂා කුසලතා දුර්වලතාවයේ සලකුණු පෙන්නුම් කරයි. වැඩි දුර නිරීක්ෂණය හා උපකාරය අවශ්‍ය වේ.",
    "Average": "ඔබේ දරුවාගේ ප්‍රකාශන භාෂා කුසලතා සාමාන්‍ය මට්ටමින් පවතින අතර වැඩි දියුණු කිරීම අවශ්‍ය විය හැක.",
    "Normal": "ඔබේ දරුවාගේ ප්‍රකාශන භාෂා කුසලතා සාමාන්‍යයෙන් සෞඛ්‍ය සම්පන්න ලෙස පවතී."
}

eld_level_sinhala_map = {
    "Normal": "ඉතා හොදයි",
    "Average": "සාමාන්‍ය",
    "Weak": "දුර්වල"
}


# -------------------------------
# Prediction Function (ELD)
# -------------------------------
def predict_new_eld(story1_eld, story2_eld, story3_eld, story4_eld):
    features_list_eld = []
    for i, story_eld in enumerate([story1_eld, story2_eld, story3_eld, story4_eld]):
        features_eld = vectorizers_eld[i].transform([story_eld])
        features_list_eld.append(features_eld)
    X_new_eld = hstack(features_list_eld)
    
    percentage_pred_eld = regressor_eld.predict(X_new_eld)[0]
    level_pred_eld_en = classifier_eld.predict(X_new_eld)[0]
    level_pred_eld_si = eld_level_sinhala_map.get(level_pred_eld_en, level_pred_eld_en)

    
    feedback_eld = feedback_map_eld.get(level_pred_eld_en, "ප්‍රතිචාර ලබා දීමට නොහැකි විය.")
    
    return {
        "Overall_Percentage": round(percentage_pred_eld, 2),
        "ELD_Level": level_pred_eld_si,
        "Feedback": feedback_eld
    }

# -------------------------------
# Flask Route (ELD)
# -------------------------------
@app.route("/predict_eld", methods=["POST"])
def predict_eld():
    data_eld = request.get_json()
    story1_eld = data_eld.get("story1", "")
    story2_eld = data_eld.get("story2", "")
    story3_eld = data_eld.get("story3", "")
    story4_eld = data_eld.get("story4", "")
    
    result_eld = predict_new_eld(story1_eld, story2_eld, story3_eld, story4_eld)
    return jsonify(result_eld)








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
    "Weak": "දරුවාගේ අවබෝධභාෂා කුසලතා අඩුයි. අඛණ්ඩ පුහුණු කිරීම අවශ්‍යයි.",
    "Average": "දරුවාගේ අවබෝධභාෂා කුසලතා සාමාන්‍ය මට්ටමක පවතී.",
    "Normal": "දරුවාගේ අවබෝධභාෂා කුසලතා සෞඛ්‍ය සම්පන්නයි."
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
    "Low": "දෘශ්‍ය වසා ගැනීමේ කුසලතාව දුර්වලයි. අතිරේක පුහුණුව අවශ්‍ය වේ.",
    "Average": "දෘශ්‍ය වසා ගැනීමේ කුසලතාව සාමාන්‍ය මට්ටමින් පවතී.",
    "High": "දෘශ්‍ය වසා ගැනීමේ කුසලතාව ඉතා හොඳයි."
}

vc_level_sinhala_map = {
    "Low": "දුර්වල",
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
