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
VD_model = joblib.load('VD_model.pkl')

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







# -------------------------------
# Run Flask App
# -------------------------------
if __name__ == "__main__":
    app.run(debug=True)
