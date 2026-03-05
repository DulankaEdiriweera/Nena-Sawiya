import os
import uuid
import random
from io import BytesIO

from flask import Blueprint, request, jsonify, current_app, send_file
from werkzeug.utils import secure_filename
from PIL import Image, ImageDraw, ImageOps

from database.db import mongo
from models.vc_pic_com_model import VCPicComModel


vc_pic_com_bp = Blueprint("vc_pic_com_bp", __name__)

ALLOWED_EXT = {"png", "jpg", "jpeg", "webp"}

LEVEL_TO_GRID = {
    "easy": (4, 4),
    "medium": (3, 3),
    "hard": (2, 2),
}


# -------------------------
# Helpers
# -------------------------
def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXT


def ensure_dir(path: str) -> None:
    os.makedirs(path, exist_ok=True)


def get_original_path(base_upload_dir: str, activity_id: str, original_url: str) -> str:
    # original_url example: /vc_uploads/<id>/original_filename.png
    fname = os.path.basename(original_url)
    return os.path.join(base_upload_dir, activity_id, fname)


def get_tile_box(img_w: int, img_h: int, rows: int, cols: int, index: int):
    """
    Calculate cropping box for the given tile index.
    Handles last row/col edges safely.
    """
    tile_w = img_w // cols
    tile_h = img_h // rows

    r = index // cols
    c = index % cols

    left = c * tile_w
    top = r * tile_h
    right = (c + 1) * tile_w if c < cols - 1 else img_w
    bottom = (r + 1) * tile_h if r < rows - 1 else img_h

    return (left, top, right, bottom)


def make_thumb(tile_rgba: Image.Image, size: int = 256) -> Image.Image:
    """
    Square padded thumbnail (no crop).
    """
    return ImageOps.pad(
        tile_rgba.convert("RGBA"),
        (size, size),
        method=Image.Resampling.LANCZOS,
        color=(255, 255, 255, 255),
        centering=(0.5, 0.5),
    )


def build_option_indices(rows: int, cols: int, missing_index: int, options_count: int):
    total = rows * cols
    options_count = max(2, min(options_count, total))

    all_indices = list(range(total))
    distractors = [i for i in all_indices if i != missing_index]
    random.shuffle(distractors)

    chosen = [missing_index] + distractors[: options_count - 1]
    random.shuffle(chosen)
    return chosen


# -------------------------------------------------
# ADMIN: Add Picture Completion Activity (NO tile files)
# POST /api/vc_pic_com/add
# form-data:
#   title, task_number, options_count(optional),
#   levels[] (easy/medium/hard)   (store ONE main level)
#   image(file)
# -------------------------------------------------
@vc_pic_com_bp.route("/add", methods=["POST"])
def add_vc_pic_com():
    title = request.form.get("title", "VC Picture Completion")
    task_number = request.form.get("task_number")
    options_count = int(request.form.get("options_count", 4))

    levels = request.form.getlist("levels[]")
    if not levels:
        levels = ["easy"]

    main_level = (levels[0] or "easy").lower().strip()
    if main_level not in LEVEL_TO_GRID:
        return jsonify({"error": "Invalid level. Use easy / medium / hard"}), 400

    rows, cols = LEVEL_TO_GRID[main_level]

    image = request.files.get("image")
    if not image:
        return jsonify({"error": "No image uploaded"}), 400
    if not allowed_file(image.filename):
        return jsonify({"error": "Invalid file type (png/jpg/jpeg/webp only)"}), 400

    activity_id = uuid.uuid4().hex
    base_upload_dir = current_app.config["VC_UPLOAD_FOLDER"]
    ensure_dir(base_upload_dir)

    act_dir = os.path.join(base_upload_dir, activity_id)
    ensure_dir(act_dir)

    original_name = secure_filename(image.filename)
    original_fname = f"original_{original_name}"
    original_path = os.path.join(act_dir, original_fname)
    image.save(original_path)

    original_url = f"/vc_uploads/{activity_id}/{original_fname}"

    # Pick missing tile
    total_tiles = rows * cols
    missing_index = random.randint(0, total_tiles - 1)

    # Choose option indices (correct + distractors)
    option_indices = build_option_indices(rows, cols, missing_index, options_count)

    # Build options (DYNAMIC image URLs)
    options = []
    for k, idx in enumerate(option_indices):
        options.append({
            "id": f"opt_{k+1}",
            "index": idx,
            "url": f"/api/vc_pic_com/{activity_id}/tile/{idx}",
            "thumb_url": f"/api/vc_pic_com/{activity_id}/tile/{idx}?thumb=1",
            "is_correct": (idx == missing_index),
        })

    correct_piece = {
        "index": missing_index,
        "row": missing_index // cols,
        "col": missing_index % cols,
    }

    activity = VCPicComModel(
        title=title,
        levels=[main_level],
        rows=rows,
        cols=cols,
        activity_id=activity_id,
        original_url=original_url,
        question_url=f"/api/vc_pic_com/{activity_id}/question",  # DYNAMIC
        missing_index=missing_index,
        correct_piece=correct_piece,
        options=options,
        task_number=int(task_number) if task_number else None,
    )

    mongo.db.vc_pic_com.insert_one(activity.to_dict())
    return jsonify({"message": "Picture completion activity added successfully", "activity_id": activity_id}), 201


# ---------------------------------------------
# USER/ADMIN: Get all
# GET /api/vc_pic_com/all?level=easy
# ---------------------------------------------
@vc_pic_com_bp.route("/all", methods=["GET"])
def get_all_vc_pic_com():
    level = request.args.get("level")
    query = {}
    if level:
        query["levels"] = level.lower().strip()

    docs = list(mongo.db.vc_pic_com.find(query, {"_id": 0}).sort("created_at", -1))
    return jsonify(docs), 200


# ---------------------------------------------
# USER: Get one by activity_id (meta)
# GET /api/vc_pic_com/<activity_id>
# ---------------------------------------------
@vc_pic_com_bp.route("/<activity_id>", methods=["GET"])
def get_vc_pic_com(activity_id):
    doc = mongo.db.vc_pic_com.find_one({"activity_id": activity_id}, {"_id": 0})
    if not doc:
        return jsonify({"error": "Activity not found"}), 404
    return jsonify(doc), 200


# ---------------------------------------------
# DYNAMIC: Question Image
# GET /api/vc_pic_com/<activity_id>/question
# ---------------------------------------------
@vc_pic_com_bp.route("/<activity_id>/question", methods=["GET"])
def get_question_image(activity_id):
    doc = mongo.db.vc_pic_com.find_one({"activity_id": activity_id}, {"_id": 0})
    if not doc:
        return jsonify({"error": "Activity not found"}), 404

    base_upload_dir = current_app.config["VC_UPLOAD_FOLDER"]
    original_path = get_original_path(base_upload_dir, activity_id, doc["original_url"])

    if not os.path.exists(original_path):
        return jsonify({"error": "Original image file missing on server"}), 500

    img = Image.open(original_path).convert("RGBA")

    rows = int(doc["rows"])
    cols = int(doc["cols"])
    missing_index = int(doc["missing_index"])

    box = get_tile_box(img.size[0], img.size[1], rows, cols, missing_index)

    q = img.copy()
    draw = ImageDraw.Draw(q)
    draw.rectangle(box, fill=(255, 255, 255, 255))

    bio = BytesIO()
    q.save(bio, "PNG")
    bio.seek(0)
    return send_file(bio, mimetype="image/png")


# ---------------------------------------------
# DYNAMIC: Tile or Thumbnail
# GET /api/vc_pic_com/<activity_id>/tile/<index>
#   ?thumb=1  -> returns padded thumbnail
# ---------------------------------------------
@vc_pic_com_bp.route("/<activity_id>/tile/<int:index>", methods=["GET"])
def get_tile_image(activity_id, index):
    doc = mongo.db.vc_pic_com.find_one({"activity_id": activity_id}, {"_id": 0})
    if not doc:
        return jsonify({"error": "Activity not found"}), 404

    rows = int(doc["rows"])
    cols = int(doc["cols"])
    total = rows * cols

    if index < 0 or index >= total:
        return jsonify({"error": "Invalid tile index"}), 400

    base_upload_dir = current_app.config["VC_UPLOAD_FOLDER"]
    original_path = get_original_path(base_upload_dir, activity_id, doc["original_url"])

    if not os.path.exists(original_path):
        return jsonify({"error": "Original image file missing on server"}), 500

    img = Image.open(original_path).convert("RGBA")
    box = get_tile_box(img.size[0], img.size[1], rows, cols, index)
    tile = img.crop(box)

    if request.args.get("thumb", "0") == "1":
        tile = make_thumb(tile, size=256)

    bio = BytesIO()
    tile.save(bio, "PNG")
    bio.seek(0)
    return send_file(bio, mimetype="image/png")


# ---------------------------------------------
# ADMIN: Delete activity (removes ONLY original folder)
# DELETE /api/vc_pic_com/<activity_id>
# ---------------------------------------------
@vc_pic_com_bp.route("/<activity_id>", methods=["DELETE"])
def delete_vc_pic_com(activity_id):
    base_upload_dir = current_app.config["VC_UPLOAD_FOLDER"]
    act_dir = os.path.join(base_upload_dir, activity_id)

    mongo.db.vc_pic_com.delete_one({"activity_id": activity_id})

    # remove folder with original image
    if os.path.exists(act_dir):
        for root, dirs, files in os.walk(act_dir, topdown=False):
            for f in files:
                try:
                    os.remove(os.path.join(root, f))
                except:
                    pass
            for d in dirs:
                try:
                    os.rmdir(os.path.join(root, d))
                except:
                    pass
        try:
            os.rmdir(act_dir)
        except:
            pass

    return jsonify({"message": "Deleted"}), 200