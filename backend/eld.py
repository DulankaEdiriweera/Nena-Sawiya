# ===============================
# Python Script: Train Models for ELD Assessment
# ===============================

import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from scipy.sparse import hstack
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score, accuracy_score, classification_report
import os
import joblib  # for saving models


# -------------------------------
# 1. Load Dataset
# -------------------------------
df_eld = pd.read_csv("ELDdata2.csv")

# Features
story_cols_eld = ["Story1_response", "Story2_response", "Story3_response", "Story4_response"]

X_text_eld = df_eld[story_cols_eld]

# Labels
y_percentage_eld = df_eld["Percentage"]
y_level_eld = df_eld["ELD_Level"]

# -------------------------------
# 2. Convert Text to Numeric Features
# -------------------------------
X_text_eld = X_text_eld.fillna('')
vectorizers_eld = []
story_features_eld = []

for col in story_cols_eld:
    vect_eld = TfidfVectorizer(max_features=2000)
    feature_eld = vect_eld.fit_transform(X_text_eld[col])
    vectorizers_eld.append(vect_eld)
    story_features_eld.append(feature_eld)

# Combine all story features horizontally
X_features_eld = hstack(story_features_eld)

# -------------------------------
# 3. Train Overall Percentage Model (Regression)
# -------------------------------
X_train_eld, X_test_eld, y_train_eld, y_test_eld = train_test_split(
    X_features_eld, y_percentage_eld, test_size=0.2, random_state=42
)

regressor_eld = RandomForestRegressor(n_estimators=100, random_state=42)
regressor_eld.fit(X_train_eld, y_train_eld)
y_pred_reg_eld = regressor_eld.predict(X_test_eld)
print("MAE:", mean_absolute_error(y_test_eld, y_pred_reg_eld))
print("RMSE:", np.sqrt(mean_squared_error(y_test_eld, y_pred_reg_eld)))
print("R2 Score:", r2_score(y_test_eld, y_pred_reg_eld))


# -------------------------------
# 4. Train ELD Level Model (Classification)
# -------------------------------
X_train_cls_eld, X_test_cls_eld, y_train_cls_eld, y_test_cls_eld = train_test_split(
    X_features_eld, y_level_eld, test_size=0.2, random_state=42
)

classifier_eld = RandomForestClassifier(n_estimators=100, random_state=42)
classifier_eld.fit(X_train_cls_eld, y_train_cls_eld)

# Evaluate ELD Level
y_pred_cls_eld = classifier_eld.predict(X_test_cls_eld)
accuracy_score_eld = accuracy_score(y_test_cls_eld, y_pred_cls_eld)
print(f"\nELD Level Accuracy: {accuracy_score_eld:.2f}")
print("\nClassification Report for ELD Level:")
print(classification_report(y_test_cls_eld, y_pred_cls_eld))

# -------------------------------
# 5. Save Models and Vectorizers
# -------------------------------

# Create folder if it doesn't exist
folder_path = "eld_models"
os.makedirs(folder_path, exist_ok=True)

joblib.dump(regressor_eld, os.path.join(folder_path,"percentage_model_eld.pkl"))
joblib.dump(classifier_eld, os.path.join(folder_path,"eld_model_eld.pkl"))
joblib.dump(vectorizers_eld, os.path.join(folder_path,"vectorizers_eld.pkl"))

# -------------------------------
# 6. Feedback Mapping
# -------------------------------
feedback_map_eld = {
    "Weak": "ඔබේ දරුවාගේ ප්‍රකාශන භාෂා කුසලතා දුර්වලතාවයේ සලකුණු පෙන්නුම් කරයි. නිරන්තර පුහුණු කිරීම අවශ්‍යයි.",
    "Average": "ඔබේ දරුවාගේ ප්‍රකාශන භාෂා කුසලතා සාමාන්‍ය මට්ටමක පවතී. වැඩිදියුණු කිරීමට මග පෙන්වීම් දිය යුතුය.",
    "Normal": "ඔබේ දරුවාගේ ප්‍රකාශන භාෂා කුසලතා සාමාන්‍යයෙන් සෞඛ්‍ය සම්පන්නය. නිතරවම පුහුණු කිරීමේ අභ්‍යාස කරමින් තවදුරටත් ශක්තිමත් කළ යුතුය."
}

# -------------------------------
# 7. Predict Example for New Student
# -------------------------------
def predict_new_eld(story1_eld, story2_eld, story3_eld, story4_eld):
    vects_eld = joblib.load(os.path.join(folder_path, "vectorizers_eld.pkl"))
    
    # Ensure all stories are strings (replace None or NaN)
    stories_eld = [story1_eld, story2_eld, story3_eld, story4_eld]
    stories_eld = [s if isinstance(s, str) else "" for s in stories_eld]
    
    features_list_eld = []
    for i, story_eld in enumerate(stories_eld):
        features_eld = vects_eld[i].transform([story_eld])
        features_list_eld.append(features_eld)
    X_new_eld = hstack(features_list_eld)
    
    regressor_loaded_eld = joblib.load(os.path.join(folder_path, "percentage_model_eld.pkl"))
    classifier_loaded_eld = joblib.load(os.path.join(folder_path, "eld_model_eld.pkl"))
    
    percentage_pred_eld = regressor_loaded_eld.predict(X_new_eld)[0]
    level_pred_eld = classifier_loaded_eld.predict(X_new_eld)[0]
    feedback_eld = feedback_map_eld.get(level_pred_eld, "ප්‍රතිචාර ලබා දීමට නොහැකි විය.")
    
    return {
        "Overall_Percentage": round(percentage_pred_eld, 2),
        "ELD_Level": level_pred_eld,
        "Feedback": feedback_eld
    }

# Example prediction
new_student_result_eld = predict_new_eld(
"ළමයෙක්  උදෑසනම  නැගිටිමින් මුහුණ සෝදාල දත් මැද පාසල් යෑමට සූදානම් වී පාසල් ඇඳුමෙන් සැරසී බත්කා වතුර බී පාසල් යෑමට පොත් බෑගේ ද වතුර බෝතලේ ද රැගෙන පාරේ ගමන් කරති",
"ළමයින් දෙදෙනෙක් කැලේ ගමන් කරන විට උගුලකට හසුවී සිටි මුව පැටියෙක් දකී ළමයි දෙදෙනා මුව පැටියා බේරාගෙන මුවු පැටියාගේ අම්මාට ඔහුව බාර දී සතුටින් මුව පැටියා මුව අම්මා යන කැලේ දෙසට යන දිසා දිහා සන්න්තෝසෙන් බලා සිටී",
"ළමයෙක් උදෑසන අවදි වී දත් මැද මූනසෝදා දෙමව්පියන්ට වැඳ  පොත් බෑගයද රැගෙන පාසල් යති ",
"අම්මා කෙනෙක් තම දරුවාට රස කැවිලි කිහිපයක් සාදා දුන්නා ඒත් ඒ දරුවා තම  යහළුවාගේ ගෙදරට ගෙන ගොස් ඒ යාළුවාට රස කැවිලි ටික දුන්නා"

)

# Pretty print the result
print("\n===== Prediction Result (ELD) =====")
print(f"Overall Percentage : {new_student_result_eld['Overall_Percentage']}%")
print(f"ELD Level          : {new_student_result_eld['ELD_Level']}")
print(f"Feedback           : {new_student_result_eld['Feedback']}")
print("===================================")
