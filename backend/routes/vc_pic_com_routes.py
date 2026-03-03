import os
import uuid
import random
from flask import Blueprint, request, jsonify, current_app
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

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXT

def ensure_dir(path):
    os.makedirs(path, exist_ok=True)

def split_image_to_tiles(img_rgba, rows, cols):
    w, h = img_rgba.size
    tile_w = w // cols
    tile_h = h // rows

    tiles = []
    idx = 0
    for r in range(rows):
        for c in range(cols):
            left = c * tile_w
            top = r * tile_h
            right = (c + 1) * tile_w if c < cols - 1 else w
            bottom = (r + 1) * tile_h if r < rows - 1 else h
            box = (left, top, right, bottom)
            tile = img_rgba.crop(box)
            tiles.append({"index": idx, "row": r, "col": c, "box": box, "tile": tile})
            idx += 1
    return tiles

def save_tiles_and_thumbs(tiles, base_upload_dir, activity_id, thumb_size=256):
    """
    Saves:
      /tiles/tile_XX.png        (original tile)
      /thumbs/thumb_XX.png      (square padded thumbnail - NO CROP)
    Returns list of {index,row,col,url,thumb_url}
    """
    tiles_dir = os.path.join(base_upload_dir, activity_id, "tiles")
    thumbs_dir = os.path.join(base_upload_dir, activity_id, "thumbs")
    ensure_dir(tiles_dir)
    ensure_dir(thumbs_dir)

    out = []
    for t in tiles:
        idx = t["index"]

        tile_fname = f"tile_{idx:02d}.png"
        tile_path = os.path.join(tiles_dir, tile_fname)
        t["tile"].save(tile_path, "PNG")

        # square padded thumbnail (no crop)
        thumb = ImageOps.pad(
            t["tile"].convert("RGBA"),
            (thumb_size, thumb_size),
            method=Image.Resampling.LANCZOS,
            color=(255, 255, 255, 255),
            centering=(0.5, 0.5),
        )
        thumb_fname = f"thumb_{idx:02d}.png"
        thumb_path = os.path.join(thumbs_dir, thumb_fname)
        thumb.save(thumb_path, "PNG")

        out.append({
            "index": idx,
            "row": t["row"],
            "col": t["col"],
            "url": f"/vc_uploads/{activity_id}/tiles/{tile_fname}",
            "thumb_url": f"/vc_uploads/{activity_id}/thumbs/{thumb_fname}",
        })
    return out

def make_question_image(original_rgba, missing_box, question_path):
    q = original_rgba.copy()
    draw = ImageDraw.Draw(q)
    draw.rectangle(missing_box, fill=(255, 255, 255, 255))
    q.save(question_path, "PNG")

def build_options(tiles_meta, missing_index, options_count=4):
    options_count = max(2, min(options_count, len(tiles_meta)))

    all_indices = [t["index"] for t in tiles_meta]
    distractors = [i for i in all_indices if i != missing_index]
    random.shuffle(distractors)

    chosen = [missing_index] + distractors[: options_count - 1]
    random.shuffle(chosen)

    def meta_of(idx):
        return next(t for t in tiles_meta if t["index"] == idx)

    options = []
    for k, idx in enumerate(chosen):
        m = meta_of(idx)
        options.append({
            "id": f"opt_{k+1}",
            "index": idx,
            "url": m["url"],
            "thumb_url": m["thumb_url"],
            "is_correct": (idx == missing_index),
        })
    return options


# -------------------------------------------------
# ADMIN: Add Picture Completion Activity (AUTO GRID)
# POST /api/vc_pic_com/add
# form-data:
#   title, task_number, options_count(optional),
#   levels[] (easy/medium/hard)  [use ONE main level ideally]
#   image(file)
# -------------------------------------------------
@vc_pic_com_bp.route("/add", methods=["POST"])
def add_vc_pic_com():
    title = request.form.get("title", "VC Picture Completion")
    task_number = request.form.get("task_number")
    options_count = int(request.form.get("options_count", 4))

    levels = request.form.getlist("levels[]")  # IMPORTANT
    if not levels:
        levels = ["easy"]

    # Use the first selected level to decide grid
    main_level = levels[0].lower().strip()
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
    original_path = os.path.join(act_dir, f"original_{original_name}")
    image.save(original_path)
    original_url = f"/vc_uploads/{activity_id}/original_{original_name}"

    img = Image.open(original_path).convert("RGBA")

    tiles = split_image_to_tiles(img, rows, cols)
    tiles_meta = save_tiles_and_thumbs(tiles, base_upload_dir, activity_id, thumb_size=256)

    max_index = rows * cols - 1
    missing_index = random.randint(0, max_index)

    missing_box = next(t["box"] for t in tiles if t["index"] == missing_index)

    question_path = os.path.join(act_dir, "question.png")
    make_question_image(img, missing_box, question_path)
    question_url = f"/vc_uploads/{activity_id}/question.png"

    correct_piece = next(t for t in tiles_meta if t["index"] == missing_index)
    options = build_options(tiles_meta, missing_index, options_count=options_count)

    activity = VCPicComModel(
        title=title,
        levels=[main_level],  # store main level only (clean filtering)
        rows=rows,
        cols=cols,
        activity_id=activity_id,
        original_url=original_url,
        question_url=question_url,
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
# USER: Get one by activity_id
# GET /api/vc_pic_com/<activity_id>
# ---------------------------------------------
@vc_pic_com_bp.route("/<activity_id>", methods=["GET"])
def get_vc_pic_com(activity_id):
    doc = mongo.db.vc_pic_com.find_one({"activity_id": activity_id}, {"_id": 0})
    if not doc:
        return jsonify({"error": "Activity not found"}), 404
    return jsonify(doc), 200


# ---------------------------------------------
# ADMIN: Delete activity
# DELETE /api/vc_pic_com/<activity_id>
# ---------------------------------------------
@vc_pic_com_bp.route("/<activity_id>", methods=["DELETE"])
def delete_vc_pic_com(activity_id):
    base_upload_dir = current_app.config["VC_UPLOAD_FOLDER"]
    act_dir = os.path.join(base_upload_dir, activity_id)

    mongo.db.vc_pic_com.delete_one({"activity_id": activity_id})

    if os.path.exists(act_dir):
        for root, dirs, files in os.walk(act_dir, topdown=False):
            for f in files:
                os.remove(os.path.join(root, f))
            for d in dirs:
                os.rmdir(os.path.join(root, d))
        os.rmdir(act_dir)

    return jsonify({"message": "Deleted"}), 200