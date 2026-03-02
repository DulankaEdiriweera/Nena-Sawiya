import os
import uuid
import shutil
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from PIL import Image
from database.db import mongo
from models.vc_jigsaw_model import VCJigsawModel

vc_jigsaw_bp = Blueprint("vc_jigsaw_bp", __name__)

ALLOWED_EXT = {"png", "jpg", "jpeg", "webp"}


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXT


def ensure_dir(path: str):
    os.makedirs(path, exist_ok=True)


def make_base_image(original_path: str, puzzle_dir: str, rows: int, cols: int):
    """
    Create a processed base image that is center-cropped to be divisible by rows/cols.
    This base image MUST be used for reference + slicing to avoid mismatch.
    """
    img = Image.open(original_path).convert("RGB")
    w, h = img.size

    # nearest divisible dimensions (crop, not stretch)
    new_w = (w // cols) * cols
    new_h = (h // rows) * rows

    # center crop box
    left = (w - new_w) // 2
    top = (h - new_h) // 2
    right = left + new_w
    bottom = top + new_h

    base = img.crop((left, top, right, bottom))

    base_path = os.path.join(puzzle_dir, "base.png")
    base.save(base_path, "PNG")  # stable format for slicing + rendering

    return base_path, new_w, new_h


def split_image_to_grid(base_image_path: str, base_upload_dir: str, rows: int, cols: int, puzzle_id: str):
    img = Image.open(base_image_path).convert("RGBA")
    w, h = img.size

    tile_w = w // cols
    tile_h = h // rows

    pieces_dir = os.path.join(base_upload_dir, puzzle_id, "pieces")
    ensure_dir(pieces_dir)

    pieces = []
    idx = 0

    # Now every tile is exactly same size (no remainder)
    for r in range(rows):
        for c in range(cols):
            left = c * tile_w
            top = r * tile_h
            right = left + tile_w
            bottom = top + tile_h

            tile = img.crop((left, top, right, bottom))

            fname = f"piece_{idx:02d}.png"
            fpath = os.path.join(pieces_dir, fname)
            tile.save(fpath, "PNG")

            pieces.append({
                "index": idx,
                "row": r,
                "col": c,
                "url": f"/vc_uploads/{puzzle_id}/pieces/{fname}",
            })
            idx += 1

    return pieces, w, h, tile_w, tile_h


# ---------------------------
# ADMIN: Add Jigsaw (Upload)
# POST /api/vc_jigsaw/add
# form-data: title, rows, cols, task_number, ability_levels[], image(file)
# ---------------------------
@vc_jigsaw_bp.route("/add", methods=["POST"])
def add_vc_jigsaw():
    title = request.form.get("title", "VC Jigsaw Puzzle")
    rows = int(request.form.get("rows", 3))
    cols = int(request.form.get("cols", 4))
    task_number = request.form.get("task_number")
    ability_levels = request.form.getlist("ability_levels[]")

    image = request.files.get("image")
    if not image:
        return jsonify({"error": "No image uploaded"}), 400
    if not allowed_file(image.filename):
        return jsonify({"error": "Invalid file type (png/jpg/jpeg/webp only)"}), 400

    puzzle_id = uuid.uuid4().hex

    base_upload_dir = current_app.config["VC_UPLOAD_FOLDER"]
    ensure_dir(base_upload_dir)

    puzzle_dir = os.path.join(base_upload_dir, puzzle_id)
    ensure_dir(puzzle_dir)

    original_name = secure_filename(image.filename)
    original_path = os.path.join(puzzle_dir, f"raw_{original_name}")
    image.save(original_path)

    # ✅ Create ONE processed base image (divisible by rows/cols)
    base_path, bw, bh = make_base_image(original_path, puzzle_dir, rows, cols)

    # ✅ Slice pieces ONLY from base image
    pieces, ow, oh, tw, th = split_image_to_grid(
        base_path, base_upload_dir, rows, cols, puzzle_id
    )

    # ✅ Reference must point to base.png (NOT raw upload)
    original_url = f"/vc_uploads/{puzzle_id}/base.png"

    jigsaw = VCJigsawModel(
        title=title,
        ability_levels=ability_levels if ability_levels else ["Weak"],
        rows=rows,
        cols=cols,
        puzzle_id=puzzle_id,
        original_url=original_url,
        pieces=pieces,
        task_number=int(task_number) if task_number else None,
        original_w=ow,
        original_h=oh,
        tile_w=tw,
        tile_h=th,
    )

    mongo.db.vc_jigsaws.insert_one(jigsaw.to_dict())
    return jsonify({"message": "VC Jigsaw added successfully", "puzzle_id": puzzle_id}), 201


# ---------------------------
# USER/ADMIN: Get all
# GET /api/vc_jigsaw/all?ability=Weak
# ---------------------------
@vc_jigsaw_bp.route("/all", methods=["GET"])
def get_all_vc_jigsaws():
    ability = request.args.get("ability")
    query = {}
    if ability:
        query["ability_levels"] = ability

    docs = list(mongo.db.vc_jigsaws.find(query, {"_id": 0}).sort("created_at", -1))
    return jsonify(docs), 200


# ---------------------------
# USER: Get one
# GET /api/vc_jigsaw/<puzzle_id>
# ---------------------------
@vc_jigsaw_bp.route("/<puzzle_id>", methods=["GET"])
def get_vc_jigsaw(puzzle_id):
    doc = mongo.db.vc_jigsaws.find_one({"puzzle_id": puzzle_id}, {"_id": 0})
    if not doc:
        return jsonify({"error": "Jigsaw not found"}), 404
    return jsonify(doc), 200


# ---------------------------
# ADMIN: Delete puzzle
# DELETE /api/vc_jigsaw/<puzzle_id>
# ---------------------------
@vc_jigsaw_bp.route("/<puzzle_id>", methods=["DELETE"])
def delete_vc_jigsaw(puzzle_id):
    base_upload_dir = current_app.config["VC_UPLOAD_FOLDER"]
    puzzle_dir = os.path.join(base_upload_dir, puzzle_id)

    mongo.db.vc_jigsaws.delete_one({"puzzle_id": puzzle_id})

    # safer delete
    if os.path.exists(puzzle_dir):
        shutil.rmtree(puzzle_dir, ignore_errors=True)

    return jsonify({"message": "Deleted"}), 200