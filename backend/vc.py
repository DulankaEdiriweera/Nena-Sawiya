import os
import json
import joblib
import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, f1_score


# =========================
# CONFIG
# =========================
DATA_FILE = "VCData.csv"
OUTPUT_DIR = "vc_models"
RANDOM_STATE = 42
TEST_SIZE = 0.2
CV_FOLDS = 5

# Correct option key (based on your description)
ANSWER_KEY = {
    "Q1": 1, "Q2": 2, "Q3": 3,
    "Q4": 2, "Q5": 1, "Q6": 1,
    "Q7": 3, "Q8": 2, "Q9": 1, "Q10": 3
}

TIME_COLS = ["Time Taken sec(level1)", "Time Taken sec(level2)", "Time Taken sec(level3)"]


# =========================
# FEATURE ENGINEERING
# =========================
def build_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Build ML features from raw answers + time.
    We do NOT use marks/total/final% because that leaks the target.
    """

    X = pd.DataFrame(index=df.index)

    # Correctness per question (0/1)
    for q, correct_opt in ANSWER_KEY.items():
        # Some columns may be float in CSV (e.g., Q9). Normalize to int safely.
        X[f"{q}_correct"] = (pd.to_numeric(df[q], errors="coerce").fillna(-999).astype(int) == correct_opt).astype(int)

    # Time features
    for tcol in TIME_COLS:
        X[tcol] = pd.to_numeric(df[tcol], errors="coerce").fillna(0)

    # Level-wise accuracy
    X["level1_correct"] = X[["Q1_correct", "Q2_correct", "Q3_correct"]].sum(axis=1)
    X["level2_correct"] = X[["Q4_correct", "Q5_correct", "Q6_correct"]].sum(axis=1)
    X["level3_correct"] = X[["Q7_correct", "Q8_correct", "Q9_correct", "Q10_correct"]].sum(axis=1)
    X["total_correct"] = X[[c for c in X.columns if c.endswith("_correct")]].sum(axis=1)

    # Speed bonus indicators (helps separate High vs Average)
    X["level1_fast"] = (X["Time Taken sec(level1)"] <= 20).astype(int)
    X["level2_fast"] = (X["Time Taken sec(level2)"] <= 20).astype(int)
    X["level3_fast"] = (X["Time Taken sec(level3)"] <= 20).astype(int)

    return X


# =========================
# TRAIN + EVALUATE
# =========================
def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    df = pd.read_csv(DATA_FILE)

    # Target
    y = df["final_label"].astype(str)

    print("Class distribution:")
    print(y.value_counts())
    print("\nClass %:")
    print((y.value_counts(normalize=True) * 100).round(2))

    # Features
    X = build_features(df)
    feature_columns = X.columns.tolist()

    # Encode labels
    le = LabelEncoder()
    y_enc = le.fit_transform(y)

    # Split (stratified)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_enc, test_size=TEST_SIZE, random_state=42, stratify=y_enc
    )

    # Model
    model = RandomForestClassifier(
    n_estimators=100,
    max_depth=12,
    min_samples_split=4,
    min_samples_leaf=2,
    max_features="sqrt",
    random_state=42,
    class_weight="balanced",
    n_jobs=-1
)

    # CV using Macro-F1 (better for imbalance + 3 classes)
    cv = StratifiedKFold(n_splits=CV_FOLDS, shuffle=True, random_state=42)
    cv_scores = cross_val_score(model, X_train, y_train, cv=cv, scoring="f1_macro")
    print(f"\nCV Macro-F1: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

    # Train
    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    f1m = f1_score(y_test, y_pred, average="macro")

    print(f"\nTest Accuracy: {acc:.4f}")
    print(f"Test Macro-F1: {f1m:.4f}\n")

    print("Classification Report:")
    print(classification_report(y_test, y_pred, target_names=le.classes_))

    print("Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))

    # Save artifacts
    joblib.dump(model, os.path.join(OUTPUT_DIR, "visual_closure_model.pkl"))
    joblib.dump(le, os.path.join(OUTPUT_DIR, "label_encoder.pkl"))

    with open(os.path.join(OUTPUT_DIR, "feature_columns.json"), "w") as f:
        json.dump(feature_columns, f, indent=2)

    # Save answer key too (useful for app)
    with open(os.path.join(OUTPUT_DIR, "answer_key.json"), "w") as f:
        json.dump(ANSWER_KEY, f, indent=2)

    print(f"\nSaved to: {OUTPUT_DIR}/")


if __name__ == "__main__":
    main()