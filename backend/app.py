from flask import Flask, request, jsonify
import os
import joblib
from scipy.sparse import hstack
from flask_cors import CORS

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

# =====================================================
# ======================= RLD =========================
# =====================================================
# Load RLD models
regressor_rld = joblib.load("rld_ridge_percentage_model.pkl")
classifier_rld = joblib.load("rld_rf_level_model.pkl")
vectorizers_rld = joblib.load("rld_vectorizers.pkl")

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

# -------------------------------
# Run Flask App
# -------------------------------
if __name__ == "__main__":
    app.run(debug=True)
