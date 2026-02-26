import sys
import os
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from datetime import datetime

# -----------------------------
# Model folder
# -----------------------------
MODEL_FOLDER = "visualD_models"
os.makedirs(MODEL_FOLDER, exist_ok=True)

MODEL_FILENAME = "VD_model.pkl"
MODEL_PATH = os.path.join(MODEL_FOLDER, MODEL_FILENAME)

# -----------------------------
# Shared preprocessing
# -----------------------------
def str_to_avg(val):
    try:
        if isinstance(val, str) and ',' in val:
            nums = [
                float(x.strip()) for x in val.split(',')
                if x.strip().replace('.', '', 1).isdigit()
            ]
            return np.mean(nums) if nums else np.nan
        elif isinstance(val, str) and val.strip().replace('.', '', 1).isdigit():
            return float(val)
        return val
    except:
        return np.nan

def preprocess_dataframe(df, has_target=False):
    df = df.copy()
    for col in df.columns:
        if has_target and col == 'Target':
            continue
        df[col] = df[col].apply(str_to_avg)
        df[col] = df[col].fillna(df[col].mean())
    return df

# -----------------------------
# Train model
# -----------------------------
def train_model(dataset_path, backup_old=True):
    data = pd.read_csv(dataset_path)
    data = preprocess_dataframe(data, has_target=True)

    X = data.drop('Target', axis=1)
    y = data['Target']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.2,
        random_state=42,
        shuffle=True
    )

    # ✅ Random Forest with class weighting
    VD_model = RandomForestClassifier(
        n_estimators=100,
        max_depth=3,
        min_samples_split=10,
        min_samples_leaf=5,
        random_state=42,
        class_weight={0: 3, 1: 1, 2: 1}  # emphasize WEAK class
    )

    VD_model.fit(X_train, y_train)
    y_pred = VD_model.predict(X_test)

    print(f"\n✅ Test Accuracy: {accuracy_score(y_test, y_pred) * 100:.2f}%")
    print("\n📊 Classification Report (Test Set):")
    print(classification_report(y_test, y_pred))
    print("\n🧮 Confusion Matrix (Test Set):")
    print(confusion_matrix(y_test, y_pred))

    # Cross-validation
    scores = cross_val_score(VD_model, X, y, cv=5)
    print("\n🔄 Cross-validation scores:", scores)
    print("Average CV accuracy:", scores.mean())

    # Backup old model
    if backup_old and os.path.exists(MODEL_PATH):
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_path = os.path.join(
            MODEL_FOLDER,
            f"VD_model_backup_{timestamp}.pkl"
        )
        os.rename(MODEL_PATH, backup_path)
        print(f"🗂️ Previous model backed up as {backup_path}")

    # Save new model
    joblib.dump(VD_model, MODEL_PATH)
    print(f"\n💾 Model saved as {MODEL_PATH}")

# -----------------------------
# Evaluate model
# -----------------------------
def evaluate_model(dataset_path):
    if not os.path.exists(MODEL_PATH):
        print("❌ No model found. Train first.")
        return

    VD_model = joblib.load(MODEL_PATH)
    data = pd.read_csv(dataset_path)
    data = preprocess_dataframe(data, has_target=True)

    X = data.drop('Target', axis=1)
    y = data['Target']

    predictions = VD_model.predict(X)

    print(f"\n✅ Evaluation Accuracy: {accuracy_score(y, predictions) * 100:.2f}%")
    print("\n📊 Classification Report (Full Dataset):")
    print(classification_report(y, predictions))

# -----------------------------
# Predict new data (CLI use)
# -----------------------------
def predict_new(csv_path):
    if not os.path.exists(MODEL_PATH):
        print("❌ No model found. Train first.")
        return

    VD_model = joblib.load(MODEL_PATH)
    data = pd.read_csv(csv_path)
    data = preprocess_dataframe(data, has_target=False)

    expected_cols = VD_model.feature_names_in_
    missing_cols = [c for c in expected_cols if c not in data.columns]
    if missing_cols:
        raise ValueError(f"Missing columns in input: {missing_cols}")

    data = data[expected_cols]
    predictions = VD_model.predict(data)
    data['Predicted_Target'] = predictions

    output_path = "predicted_output.csv"
    data.to_csv(output_path, index=False)

    print("🔮 Predictions completed")
    print(data)
    print(f"\n📁 Saved as {output_path}")

# -----------------------------
# Command-line interface
# -----------------------------
if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python visualDiscrimination.py [train|evaluate|predict] <dataset_path>")
        sys.exit(1)

    mode = sys.argv[1]
    dataset_path = sys.argv[2]

    if mode == "train":
        train_model(dataset_path)
    elif mode == "evaluate":
        evaluate_model(dataset_path)
    elif mode == "predict":
        predict_new(dataset_path)
    else:
        print("Invalid mode. Use train, evaluate, or predict")