# routes/rld_wh_routes.py
import os, json, random
from flask import Blueprint, request, jsonify, current_app
from flask_cors import cross_origin
from werkzeug.utils import secure_filename
from bson import ObjectId
from database.db import mongo
from models.rld_wh_model import RLD_WH_Question

rld_wh_bp = Blueprint("rld_wh_bp", __name__)

@rld_wh_bp.after_request
def add_cors(response):
    response.headers["Access-Control-Allow-Origin"]  = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    return response

OPTIONS_COUNT = { "easy": 2, "medium": 3, "hard": 4 }
WH_TYPES      = ["කවුද", "කොහේ", "මොකද", "කවදා", "ඇයි"]

def save_audio(file):
    folder = current_app.config["RLD_UPLOAD_FOLDER"]
    os.makedirs(folder, exist_ok=True)
    name = secure_filename(file.filename)
    file.save(os.path.join(folder, name))
    return f"http://localhost:5000/rld_uploads/{name}"


# POST /api/rld_wh/add_question
@rld_wh_bp.route("/add_question", methods=["POST", "OPTIONS"])
@cross_origin()
def add_question():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    try:
        print("FORM:", list(request.form.keys()))
        print("FILES:", list(request.files.keys()))

        level         = request.form.get("level")
        wh_type       = request.form.get("wh_type")
        question_text = request.form.get("question_text")
        correct_index = int(request.form.get("correct_index"))

        if wh_type not in WH_TYPES:
            return jsonify({"error": "Invalid wh_type"}), 400
        if not (0 <= correct_index <= 3):
            return jsonify({"error": "correct_index must be 0–3"}), 400

        scene_audio_url    = save_audio(request.files["scene_audio"])
        question_audio_url = save_audio(request.files["question_audio"])

        # options: [{ text }] — pure text, no images
        options_meta = json.loads(request.form.get("options"))
        if len(options_meta) != 4:
            return jsonify({"error": "Exactly 4 text options required"}), 400

        options = [{"text": m["text"]} for m in options_meta]

        mongo.db.rld_wh_questions.insert_one(
            RLD_WH_Question(
                level, wh_type, scene_audio_url,
                question_audio_url, question_text, options, correct_index
            ).to_dict()
        )
        return jsonify({"message": "WH question added successfully!"})
    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)}), 400


# GET /api/rld_wh/get_question/<level>?wh_type=කවුද&seen=id1,id2
@rld_wh_bp.route("/get_question/<level>", methods=["GET", "OPTIONS"])
@cross_origin()
def get_question(level):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    wh_filter  = request.args.get("wh_type")
    seen_param = request.args.get("seen", "")
    seen_ids   = [s.strip() for s in seen_param.split(",") if s.strip()]

    query = {"level": level}
    if wh_filter and wh_filter in WH_TYPES:
        query["wh_type"] = wh_filter

    all_qs = list(mongo.db.rld_wh_questions.find(query))
    if not all_qs:
        return jsonify({"error": "No questions found"}), 404

    unseen = [q for q in all_qs if str(q["_id"]) not in seen_ids]
    pool   = unseen if unseen else all_qs
    q      = random.choice(pool)

    n           = OPTIONS_COUNT.get(level, 4)
    correct_opt = q["options"][q["correct_index"]]
    distractors = [o for i, o in enumerate(q["options"]) if i != q["correct_index"]]
    random.shuffle(distractors)
    shown = [correct_opt] + distractors[:n - 1]
    random.shuffle(shown)
    new_correct_index = shown.index(correct_opt)

    return jsonify({
        "question_id":        str(q["_id"]),
        "wh_type":            q["wh_type"],
        "scene_audio_url":    q["scene_audio_url"],
        "question_audio_url": q["question_audio_url"],
        "question_text":      q["question_text"],
        "options":            shown,               # [{ text }]
        "correct_index":      new_correct_index,
        "level":              q["level"],
    })


# POST /api/rld_wh/submit
@rld_wh_bp.route("/submit", methods=["POST", "OPTIONS"])
@cross_origin()
def submit():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    data = request.get_json()
    return jsonify({
        "correct":        data.get("selected_index") == data.get("correct_index"),
        "correct_index":  data.get("correct_index"),
        "selected_index": data.get("selected_index"),
    })

@rld_wh_bp.route("/admin_get_questions/<level>", methods=["GET", "OPTIONS"])
@cross_origin()
def admin_get_questions(level):
    if request.method == "OPTIONS":
        return jsonify({}), 200
    questions = list(mongo.db.rld_wh_questions.find({"level": level}))
    results = []
    for q in questions:
        results.append({
            "question_id":        str(q["_id"]),
            "level":              q["level"],
            "wh_type":            q["wh_type"],
            "scene_audio_url":    q["scene_audio_url"],
            "question_audio_url": q["question_audio_url"],
            "question_text":      q["question_text"],
            "options":            q["options"],
            "correct_index":      q["correct_index"],
            "created_at":         str(q.get("created_at", "")),
        })
    return jsonify(results)

@rld_wh_bp.route("/delete_question/<question_id>", methods=["DELETE", "OPTIONS"])
@cross_origin(methods=["DELETE", "OPTIONS"])
def delete_wh_question(question_id):
    if request.method == "OPTIONS":
        return jsonify({}), 200
    result = mongo.db.rld_wh_questions.delete_one({"_id": ObjectId(question_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Not found"}), 404
    return jsonify({"message": "Deleted successfully"})

@rld_wh_bp.route("/update_question/<question_id>", methods=["PUT", "OPTIONS"])
@cross_origin()
def update_wh_question(question_id):
    if request.method == "OPTIONS":
        return jsonify({}), 200
    try:
        update_fields = {}

        level         = request.form.get("level")
        wh_type       = request.form.get("wh_type")
        question_text = request.form.get("question_text")
        correct_index = request.form.get("correct_index")
        options_raw   = request.form.get("options")  # JSON string [{ text }]

        if level:
            update_fields["level"] = level
        if wh_type:
            if wh_type not in ["කවුද", "කොහේ", "මොකද", "කවදා", "ඇයි"]:
                return jsonify({"error": "Invalid wh_type"}), 400
            update_fields["wh_type"] = wh_type
        if question_text:
            update_fields["question_text"] = question_text
        if correct_index is not None:
            update_fields["correct_index"] = int(correct_index)
        if options_raw:
            options_meta = json.loads(options_raw)
            if len(options_meta) != 4:
                return jsonify({"error": "Exactly 4 options required"}), 400
            update_fields["options"] = [{"text": m["text"]} for m in options_meta]

        # Update audio files only if new ones uploaded
        if "scene_audio" in request.files:
            update_fields["scene_audio_url"] = save_audio(request.files["scene_audio"])
        if "question_audio" in request.files:
            update_fields["question_audio_url"] = save_audio(request.files["question_audio"])

        mongo.db.rld_wh_questions.update_one(
            {"_id": ObjectId(question_id)},
            {"$set": update_fields}
        )
        return jsonify({"message": "WH question updated successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400