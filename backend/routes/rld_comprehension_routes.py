import os, random, time, json
from flask import Blueprint, request, jsonify, send_from_directory
from flask_cors import cross_origin
from werkzeug.utils import secure_filename
from bson import ObjectId
from database.db import mongo
from models.rld_comprehension_model import RLD_Comprehension_Passage

rld_comprehension_bp = Blueprint("rld_comprehension_bp", __name__)


# CONFIG
UPLOAD_FOLDER = "rld_uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_AUDIO_TYPES = {
    "audio/mpeg", "audio/wav", "audio/ogg",
    "audio/mp4", "audio/webm", "audio/x-m4a", "video/mp4"
}

LEVEL_RULES = {
    "easy":   {"min_q": 1, "max_q": 2},
    "medium": {"min_q": 2, "max_q": 3},
    "hard":   {"min_q": 3, "max_q": 4},
}


# CORS
@rld_comprehension_bp.after_request
def add_cors(response):
    response.headers["Access-Control-Allow-Origin"]  = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    return response


# SAVE AUDIO FILE
def save_audio_file(req):
    audio_file = req.files.get("audio")

    if not audio_file or audio_file.filename == "":
        return None

    if audio_file.mimetype not in ALLOWED_AUDIO_TYPES:
        raise ValueError(f"Unsupported audio type '{audio_file.mimetype}'")

    filename = secure_filename(audio_file.filename)
    unique_name = f"{int(time.time())}_{filename}"

    file_path = os.path.join(UPLOAD_FOLDER, unique_name)
    audio_file.save(file_path)

    return f"/rld_uploads/{unique_name}"


# SERVE UPLOADED FILES
@rld_comprehension_bp.route('/rld_uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# ADD PASSAGE
@rld_comprehension_bp.route("/add_passage", methods=["POST", "OPTIONS"])
@cross_origin()
def add_passage():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    try:
        if "multipart/form-data" in (request.content_type or ""):
            level     = request.form.get("level")
            passage   = request.form.get("passage")
            questions = json.loads(request.form.get("questions", "[]"))
            audio_url = save_audio_file(request)
        else:
            data      = request.get_json()
            level     = data.get("level")
            passage   = data.get("passage")
            questions = data.get("questions")
            audio_url = None

        if not level or not passage or not questions:
            return jsonify({"error": "Missing level, passage, or questions"}), 400

        rules = LEVEL_RULES.get(level)
        if not rules:
            return jsonify({"error": "Invalid level"}), 400

        if not (rules["min_q"] <= len(questions) <= rules["max_q"]):
            return jsonify({"error": f"{level} requires {rules['min_q']}–{rules['max_q']} questions"}), 400

        for i, q in enumerate(questions):
            if not q.get("question"):
                return jsonify({"error": f"Question {i+1} is empty"}), 400
            if len(q.get("options", [])) != 4:
                return jsonify({"error": f"Question {i+1} must have 4 options"}), 400
            if q.get("correct_index") not in [0,1,2,3]:
                return jsonify({"error": f"Question {i+1} invalid correct_index"}), 400

        mongo.db.rld_comprehension_passages.insert_one(
            RLD_Comprehension_Passage(level, passage, questions, audio_url).to_dict()
        )

        return jsonify({"message": "Passage added successfully!"})

    except Exception as e:
        return jsonify({"error": str(e)}), 400

# GET PASSAGE (STUDENT)
@rld_comprehension_bp.route("/get_passage/<level>", methods=["GET", "OPTIONS"])
@cross_origin()
def get_passage(level):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    passages = list(mongo.db.rld_comprehension_passages.find({"level": level}))
    if not passages:
        return jsonify({"error": "No passages found"}), 404

    p = random.choice(passages)

    safe_questions = [
        {"question": q["question"], "options": q["options"]}
        for q in p["questions"]
    ]

    return jsonify({
        "_id":       str(p["_id"]),
        "level":     p["level"],
        "passage":   p["passage"],
        "questions": safe_questions,
        "audio":     p.get("audio_url")
    })


# CHECK ANSWERS
@rld_comprehension_bp.route("/check_answers", methods=["POST", "OPTIONS"])
@cross_origin()
def check_answers():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    try:
        data       = request.get_json()
        passage_id = data.get("passage_id")
        answers    = data.get("answers")

        p = mongo.db.rld_comprehension_passages.find_one({"_id": ObjectId(passage_id)})

        correct = 0
        results = []

        for i, q in enumerate(p["questions"]):
            student = answers[i] if i < len(answers) else None
            correct_idx = q["correct_index"]

            is_correct = student == correct_idx
            if is_correct:
                correct += 1

            results.append({
                "question": q["question"],
                "options": q["options"],
                "correct_index": correct_idx,
                "your_index": student,
                "correct": is_correct
            })

        total = len(p["questions"])

        return jsonify({
            "percent": round(correct/total*100,2),
            "score": correct,
            "total": total,
            "results": results
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ADMIN GET
@rld_comprehension_bp.route("/admin_get_passages/<level>", methods=["GET", "OPTIONS"])
@cross_origin()
def admin_get_passages(level):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    passages = list(mongo.db.rld_comprehension_passages.find({"level": level}))

    return jsonify([{
        "_id": str(p["_id"]),
        "level": p["level"],
        "passage": p["passage"],
        "questions": p["questions"],
        "audio": p.get("audio_url"),
        "created_at": str(p.get("created_at", ""))
    } for p in passages])


# DELETE
@rld_comprehension_bp.route("/delete_passage/<id>", methods=["DELETE", "OPTIONS"])
@cross_origin()
def delete_passage(id):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    mongo.db.rld_comprehension_passages.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "Deleted successfully"})


# UPDATE
@rld_comprehension_bp.route("/update_passage/<id>", methods=["PUT", "OPTIONS"])
@cross_origin()
def update_passage(id):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    try:
        if "multipart/form-data" in (request.content_type or ""):
            level        = request.form.get("level")
            passage      = request.form.get("passage")
            questions_raw = request.form.get("questions")
            # FIX: parse questions only if the field was sent, preserving empty arrays
            questions    = json.loads(questions_raw) if questions_raw is not None else None
            remove_audio = request.form.get("remove_audio") == "true"
            audio_url    = save_audio_file(request)
        else:
            data         = request.get_json()
            level        = data.get("level")
            passage      = data.get("passage")
            # FIX: use .get with a sentinel so missing key vs explicit None/[] are distinct
            questions    = data.get("questions", "__missing__")
            if questions == "__missing__":
                questions = None
            remove_audio = data.get("remove_audio", False)
            audio_url    = None

        update = {}

        if level:
            update["level"] = level
        if passage:
            update["passage"] = passage

        # FIX: update questions whenever the field was explicitly provided,
        # including when it is an empty list — previously `if questions` skipped []
        if questions is not None:
            update["questions"] = questions

        if audio_url:
            update["audio_url"] = audio_url
        elif remove_audio:
            update["audio_url"] = None

        mongo.db.rld_comprehension_passages.update_one(
            {"_id": ObjectId(id)},
            {"$set": update}
        )

        return jsonify({"message": "Updated successfully"})

    except Exception as e:
        return jsonify({"error": str(e)}), 400