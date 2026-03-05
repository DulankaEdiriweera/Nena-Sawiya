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
from flask_jwt_extended import JWTManager
from routes.auth_routes import auth_bp
from routes.eld_routes import eld_bp
from routes.eld_storyClozeRoutes import story_bp
from routes.eld_picture_mcq_routes import picture_bp
from routes.sequencing_routes import sequencing_bp
from routes.rld_routes import rld_bp
from routes.rld_direction_routes import rld_direction_bp
from routes.rld_jumbled_routes import rld_jumbled_bp
from routes.rld_categorize_routes import rld_categorize_bp
from routes.rld_comprehension_routes import rld_comprehension_bp
from routes.rld_wh_routes import rld_wh_bp
from routes.vc_routes import vc_bp
from routes.eld_progress_bp import eld_progress_bp


from routes.vd_routes import vd_bp
from routes.vd_drag_drop_text_image_routes import vd_drag_text_bp
from routes.vd_picture_mcq_routes import vd_picture_bp
from routes.vd_memory_image_routes import vd_memory_bp
from routes.vd_count_image_routes import vd_count_bp
from routes.vd_progress import vd_progress_bp


from routes.vc_jigsaw_routes import vc_jigsaw_bp
from routes.vc_pic_com_routes import vc_pic_com_bp
from routes.vc_sha_mat_routes import vc_sha_mat_bp
from routes.rld_progress_bp import rld_progress_bp
from routes.vc_progress_bp import vc_progress_bp

# -------------------------------
# Flask App Setup
# -------------------------------
app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)

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


# -------------------------------
# VD Uploads Folder
# -------------------------------
VD_UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "vd_uploads")
os.makedirs(VD_UPLOAD_FOLDER, exist_ok=True)
app.config["VD_UPLOAD_FOLDER"] = VD_UPLOAD_FOLDER

# -------------------------------
# VC Uploads Folder
# -------------------------------
VC_UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "vc_uploads")
os.makedirs(VC_UPLOAD_FOLDER, exist_ok=True)
app.config["VC_UPLOAD_FOLDER"] = VC_UPLOAD_FOLDER


# Register Blueprints

app.register_blueprint(auth_bp,url_prefix="/api/auth")

#ELD
app.register_blueprint(eld_bp)
app.register_blueprint(picture_bp, url_prefix="/api/picture_mcq")
app.register_blueprint(story_bp, url_prefix="/api/story_bp")
app.register_blueprint(sequencing_bp, url_prefix="/api/sequencing_bp")
app.register_blueprint(eld_progress_bp, url_prefix="/api/eld")

#RLD
app.register_blueprint(rld_bp)
app.register_blueprint(rld_direction_bp, url_prefix="/api/rld_direction_bp")
app.register_blueprint(rld_jumbled_bp, url_prefix="/api/rld_jumbled")
app.register_blueprint(rld_categorize_bp, url_prefix="/api/rld_categorize")
app.register_blueprint(rld_comprehension_bp, url_prefix="/api/rld_comprehension")
app.register_blueprint(rld_wh_bp, url_prefix="/api/rld_wh")
app.register_blueprint(rld_progress_bp, url_prefix="/api/rld")

# VISUAL CLOSURE 
app.register_blueprint(vc_bp)
app.register_blueprint(vc_jigsaw_bp, url_prefix="/api/vc_jigsaw")
app.register_blueprint(vc_pic_com_bp, url_prefix="/api/vc_pic_com")
app.register_blueprint(vc_sha_mat_bp, url_prefix="/api/vc_sha_mat")
app.register_blueprint(vc_progress_bp, url_prefix="/api/vc")

#VISUAL DISCRIMINATION
app.register_blueprint(vd_bp)
app.register_blueprint(vd_drag_text_bp, url_prefix="/api/vd_drag_text")
app.register_blueprint(vd_picture_bp, url_prefix="/api/vd_picture_mcq")
app.register_blueprint(vd_memory_bp, url_prefix="/api/vd_memory")
app.register_blueprint(vd_count_bp, url_prefix="/api/vd_count")
app.register_blueprint(vd_progress_bp, url_prefix="/api/vd")




# Serve uploaded audio files
#ELD
@app.route('/uploads/<path:filename>')
def serve_audio(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# RLD
@app.route('/rld_uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['RLD_UPLOAD_FOLDER'], filename)

#VD 
@app.route('/vd_uploads/<filename>')
def serve_vd_uploads(filename):
    return send_from_directory(app.config['VD_UPLOAD_FOLDER'], filename)

#VC
@app.route('/vc_uploads/<path:filename>')
def serve_vc_uploads(filename):
    return send_from_directory(app.config["VC_UPLOAD_FOLDER"], filename)



# -------------------------------
# Run Flask App
# -------------------------------
if __name__ == "__main__":
    app.run(debug=True)
