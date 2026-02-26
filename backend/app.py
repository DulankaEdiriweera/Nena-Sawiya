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
#from routes.eld_picture_mcq_routes import picture_bp
from routes.rld_routes import rld_bp
from routes.rld_direction_routes import rld_direction_bp
from routes.vc_routes import vc_bp

# -------------------------------
# Flask App Setup
# -------------------------------
app = Flask(__name__)
CORS(app)  # allow all origins; for development only


# Initialize MongoDB
init_db(app)


# Configure uploads folder
#ELD Uploads Folder
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# -------------------------------
# RLD Uploads Folder
# -------------------------------
RLD_UPLOAD_FOLDER = "rld_uploads"
if not os.path.exists(RLD_UPLOAD_FOLDER):
    os.makedirs(RLD_UPLOAD_FOLDER)
app.config["RLD_UPLOAD_FOLDER"] = RLD_UPLOAD_FOLDER

# Register Blueprints
#ELD
app.register_blueprint(eld_bp)
#app.register_blueprint(picture_bp, url_prefix="/api/picture_mcq")
app.register_blueprint(story_bp, url_prefix="/api/story_bp")

#RLD
app.register_blueprint(rld_bp)
app.register_blueprint(rld_direction_bp, url_prefix="/rld")

# VISUAL CLOSURE 
app.register_blueprint(vc_bp)

# Serve uploaded audio files
#ELD
@app.route('/uploads/<path:filename>')
def serve_audio(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# RLD
@app.route('/rld_uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['RLD_UPLOAD_FOLDER'], filename)



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


# -------------------------------
# Run Flask App
# -------------------------------
if __name__ == "__main__":
    app.run(debug=True)
