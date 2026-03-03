import os
import uuid
import shutil

import numpy as np
from PIL import Image, ImageOps

from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename

from database.db import mongo
from models.vc_sha_mat_model import VCShaMatModel

vc_sha_mat_bp = Blueprint("vc_sha_mat_bp", __name__)

ALLOWED_EXT = {"png", "jpg", "jpeg", "webp"}


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXT


def ensure_dir(path: str):
    os.makedirs(path, exist_ok=True)


def otsu_threshold(gray_np: np.ndarray) -> int:
    """
    Otsu thresholding for grayscale image (0..255).
    """
    hist, _ = np.histogram(gray_np.flatten(), bins=256, range=(0, 256))
    total = gray_np.size
    sum_total = np.dot(np.arange(256), hist)

    sum_b = 0.0
    w_b = 0.0
    max_var = 0.0
    threshold = 127

    for t in range(256):
        w_b += hist[t]
        if w_b == 0:
            continue

        w_f = total - w_b
        if w_f == 0:
            break

        sum_b += t * hist[t]
        m_b = sum_b / w_b
        m_f = (sum_total - sum_b) / w_f

        var_between = w_b * w_f * (m_b - m_f) ** 2
        if var_between > max_var:
            max_var = var_between
            threshold = t

    return int(threshold)


def make_shadow_image(correct_path: str, out_path: str):
    """
    Create a kid-friendly silhouette:
    - Convert to grayscale
    - Auto-contrast
    - Otsu threshold -> binary mask
    - Foreground becomes black, background white
    """
    img = Image.open(correct_path).convert("RGBA")

    # white background composite (handle transparent uploads)
    bg = Image.new("RGBA", img.size, (255, 255, 255, 255))
    comp = Image.alpha_composite(bg, img).convert("RGB")

    gray = ImageOps.grayscale(comp)
    gray = ImageOps.autocontrast(gray)

    g = np.array(gray, dtype=np.uint8)
    t = otsu_threshold(g)

    # Binary mask: "dark" pixels are likely object; invert if needed
    mask = (g < t).astype(np.uint8)

    # If mask is tiny, maybe object is bright and background is dark -> flip
    coverage = mask.mean()
    if coverage < 0.06:
        mask = 1 - mask

    # Create shadow: black where mask=1 else white
    shadow = np.ones((g.shape[0], g.shape[1], 3), dtype=np.uint8) * 255
    shadow[mask == 1] = (0, 0, 0)

    out = Image.fromarray(shadow, mode="RGB")
    out.save(out_path, "PNG")


# ---------------------------
# ADMIN: Add Shadow Match
# POST /api/vc_sha_mat/add
# form-data:
#   title
#   task_number
#   levels[]  (easy/medium/hard)
#   correct_image (file)
#   option_images[] (files)  (distractors)
# ---------------------------
@vc_sha_mat_bp.route("/add", methods=["POST"])
def add_vc_sha_mat():
    title = request.form.get("title", "Shadow Match")
    task_number = request.form.get("task_number")
    levels = request.form.getlist("levels[]")

    correct_image = request.files.get("correct_image")
    option_images = request.files.getlist("option_images[]")  # distractors

    if not correct_image:
        return jsonify({"error": "correct_image is required"}), 400

    if not allowed_file(correct_image.filename):
        return jsonify({"error": "Invalid correct_image type (png/jpg/jpeg/webp only)"}), 400

    if not levels:
        return jsonify({"error": "Select at least one level (easy/medium/hard)."}), 400

    # you can tune these limits
    if len(option_images) < 2:
        return jsonify({"error": "Upload at least 2 option_images (distractors)."}), 400
    if len(option_images) > 5:
        return jsonify({"error": "Maximum 5 option_images allowed."}), 400

    for f in option_images:
        if not allowed_file(f.filename):
            return jsonify({"error": "Invalid option_images type (png/jpg/jpeg/webp only)"}), 400

    activity_id = uuid.uuid4().hex

    base_upload_dir = current_app.config["VC_UPLOAD_FOLDER"]
    ensure_dir(base_upload_dir)

    act_dir = os.path.join(base_upload_dir, activity_id)
    ensure_dir(act_dir)

    # save correct image
    correct_name = secure_filename(correct_image.filename)
    correct_path = os.path.join(act_dir, f"correct_{correct_name}")
    correct_image.save(correct_path)

    # generate shadow
    shadow_path = os.path.join(act_dir, "shadow.png")
    make_shadow_image(correct_path, shadow_path)

    # build options: include correct image + distractors
    options = []

    # copy correct to stable filename for serving
    correct_out = os.path.join(act_dir, "option_correct.png")
    shutil.copyfile(correct_path, correct_out)

    options.append({
        "id": "correct",
        "url": f"/vc_uploads/{activity_id}/option_correct.png",
        "is_correct": True
    })

    # save distractors
    for i, f in enumerate(option_images):
        fname = f"option_{i+1:02d}.png"
        fpath = os.path.join(act_dir, fname)
        Image.open(f).convert("RGBA").save(fpath, "PNG")  # normalize format

        options.append({
            "id": f"opt_{i+1:02d}",
            "url": f"/vc_uploads/{activity_id}/{fname}",
            "is_correct": False
        })

    # shuffle options (but keep correctness)
    rng = np.random.default_rng()
    rng.shuffle(options)

    doc = VCShaMatModel(
        title=title,
        levels=levels,
        activity_id=activity_id,
        original_url=f"/vc_uploads/{activity_id}/option_correct.png",
        shadow_url=f"/vc_uploads/{activity_id}/shadow.png",
        options=options,
        task_number=int(task_number) if task_number else None
    )

    mongo.db.vc_sha_mats.insert_one(doc.to_dict())
    return jsonify({"message": "Shadow Match added successfully", "activity_id": activity_id}), 201


# ---------------------------
# USER/ADMIN: Get all
# GET /api/vc_sha_mat/all?level=easy
# ---------------------------
@vc_sha_mat_bp.route("/all", methods=["GET"])
def get_all_vc_sha_mats():
    level = request.args.get("level")
    query = {}
    if level:
        query["levels"] = level  # levels is a list field

    docs = list(mongo.db.vc_sha_mats.find(query, {"_id": 0}).sort("created_at", -1))
    return jsonify(docs), 200


# ---------------------------
# USER: Get one
# GET /api/vc_sha_mat/<activity_id>
# ---------------------------
@vc_sha_mat_bp.route("/<activity_id>", methods=["GET"])
def get_vc_sha_mat(activity_id):
    doc = mongo.db.vc_sha_mats.find_one({"activity_id": activity_id}, {"_id": 0})
    if not doc:
        return jsonify({"error": "Shadow Match activity not found"}), 404
    return jsonify(doc), 200


# ---------------------------
# ADMIN: Delete
# DELETE /api/vc_sha_mat/<activity_id>
# ---------------------------
@vc_sha_mat_bp.route("/<activity_id>", methods=["DELETE"])
def delete_vc_sha_mat(activity_id):
    base_upload_dir = current_app.config["VC_UPLOAD_FOLDER"]
    act_dir = os.path.join(base_upload_dir, activity_id)

    mongo.db.vc_sha_mats.delete_one({"activity_id": activity_id})

    if os.path.exists(act_dir):
        shutil.rmtree(act_dir, ignore_errors=True)

    return jsonify({"message": "Deleted"}), 200