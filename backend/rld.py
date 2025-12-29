# ===============================
# Python Script: Ridge Regression & Random Forest Classifier for RLD Assessment
# ===============================

import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from scipy.sparse import hstack
from sklearn.model_selection import train_test_split
from sklearn.linear_model import Ridge
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score, accuracy_score, classification_report
import os
import joblib

# -------------------------------
# 1. Load Dataset
# -------------------------------
df_rld = pd.read_csv("RLD_Dataset_Cleaned.csv", encoding="utf-8-sig")

question_cols_rld = [
    "Q1_i","Q1_ii","Q1_iii","Q1_iv",
    "Q2_i","Q2_ii","Q3_i","Q3_ii",
    "Q4","Q5_i","Q5_ii","Q5_iii",
    "Q6_i","Q6_ii","Q7"
]

X_text_rld = df_rld[question_cols_rld].fillna('')
y_percentage_rld = df_rld["Percentage"]
y_level_rld = df_rld["RLD_level"]

# -------------------------------
# 2. TF-IDF Vectorization
# -------------------------------
vectorizers_rld = []
features_rld = []

for col in question_cols_rld:
    vect_rld = TfidfVectorizer(max_features=2000, ngram_range=(1,3))
    feat_rld = vect_rld.fit_transform(X_text_rld[col])
    vectorizers_rld.append(vect_rld)
    features_rld.append(feat_rld)

X_features_rld = hstack(features_rld)

# -------------------------------
# 3. Split Datasets
# -------------------------------
# Regression
X_train_r, X_test_r, y_train_r, y_test_r = train_test_split(
    X_features_rld, y_percentage_rld, test_size=0.2, random_state=42
)

# Classification
X_train_c, X_test_c, y_train_c, y_test_c = train_test_split(
    X_features_rld, y_level_rld, test_size=0.2, random_state=42, stratify=y_level_rld
)

# -------------------------------
# 4. Train Ridge Regression (Percentage)
# -------------------------------
ridge_model = Ridge(alpha=1.0)
ridge_model.fit(X_train_r, y_train_r)
y_pred_ridge = ridge_model.predict(X_test_r)

print("=== Ridge Regression (Percentage) ===")
print("MAE:", mean_absolute_error(y_test_r, y_pred_ridge))
print("RMSE:", np.sqrt(mean_squared_error(y_test_r, y_pred_ridge)))
print("R2 Score:", r2_score(y_test_r, y_pred_ridge))

# Create folder if it doesn't exist
folder_path = "rld_models"
os.makedirs(folder_path, exist_ok=True)

joblib.dump(ridge_model,os.path.join(folder_path,"rld_ridge_percentage_model.pkl"))

# -------------------------------
# 5. Train Random Forest Classifier (RLD Level)
# -------------------------------
rf_clf = RandomForestClassifier(n_estimators=100, class_weight="balanced", random_state=42, n_jobs=-1)
rf_clf.fit(X_train_c, y_train_c)
y_pred_rf = rf_clf.predict(X_test_c)

print("\n=== Random Forest Classifier (RLD Level) ===")
print("Accuracy:", accuracy_score(y_test_c, y_pred_rf))
print(classification_report(y_test_c, y_pred_rf))

joblib.dump(rf_clf,os.path.join(folder_path, "rld_rf_level_model.pkl"))

# -------------------------------
# 6. Save Vectorizers
# -------------------------------
joblib.dump(vectorizers_rld,os.path.join(folder_path, "rld_vectorizers.pkl"))
print("\n✅ Vectorizers and models saved successfully.")

# -------------------------------
# 7. Feedback Mapping
# -------------------------------
feedback_map_rld = {
    "Weak": "දරුවාගේ අවබෝධභාෂා කුසලතා අඩුයි. අඛණ්ඩ පුහුණු කිරීම අවශ්‍යයි.",
    "Average": "දරුවාගේ අවබෝධභාෂා කුසලතා සාමාන්‍ය මට්ටමක පවතී. වැඩිදියුණු කිරීමට මග පෙන්වීම් අවශ්‍යයි.",
    "Normal": "දරුවාගේ අවබෝධභාෂා කුසලතා සෞඛ්‍ය සම්පන්නයි. නිතර පුහුණු කිරීමෙන් තවත් ශක්තිමත් කළ හැක."
}

# -------------------------------
# 8. Predict Function for New Student
# -------------------------------
def predict_new_rld(**responses):
    vects_rld = joblib.load(os.path.join(folder_path,"rld_vectorizers.pkl"))
    features_list_rld = []

    for i, col in enumerate(question_cols_rld):
        text = responses.get(col, "")
        feat_rld = vects_rld[i].transform([text])
        features_list_rld.append(feat_rld)

    X_new_rld = hstack(features_list_rld)

    # Load models
    ridge_loaded = joblib.load(os.path.join(folder_path,"rld_ridge_percentage_model.pkl"))
    rf_loaded = joblib.load(os.path.join(folder_path,"rld_rf_level_model.pkl"))

    percentage_pred = ridge_loaded.predict(X_new_rld)[0]
    level_pred = rf_loaded.predict(X_new_rld)[0]
    feedback = feedback_map_rld.get(level_pred, "ප්‍රතිචාර ලබා දීමට නොහැකි විය.")

    return {
        "Overall_Percentage": round(percentage_pred, 2),
        "RLD_Level": level_pred,
        "Feedback": feedback
    }

# -------------------------------
# 9. Example Prediction
# -------------------------------
example_responses_rld = {
    "Q1_i": "වැස්ස",
    "Q1_ii": "කූඩුවට",
    "Q1_iii": "කලබලෙන්",
    "Q1_iv": "රෙදි ටික",
    "Q2_i": "සහන්",
    "Q2_ii": "කසුන්",
    "Q3_i": "අම්මා රූපවාහිනිය බලනවා",
    "Q3_ii": "හොඳින් ඉගෙන ගෙන යහපත් පුරවැසියන් වෙමු",
    "Q4": "අටයි",
    "Q5_i": "ගස",
    "Q5_ii": "ළිඳ",
    "Q5_iii": "මල් පාත්තිය",
    "Q6_i": "අන්නාසි ගෙඩිය",
    "Q6_ii": "සපත්තු 2",
    "Q7": "සඳුදා"
}

result_rld = predict_new_rld(**example_responses_rld)

print("\n===== Prediction Result (RLD) =====")
print(f"Overall Percentage : {result_rld['Overall_Percentage']}%")
print(f"RLD Level          : {result_rld['RLD_Level']}")
print(f"Feedback           : {result_rld['Feedback']}")
print("===================================")
