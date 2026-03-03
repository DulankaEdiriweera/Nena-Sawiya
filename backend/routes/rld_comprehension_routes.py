# routes/rld_comprehension_routes.py
import random
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from bson import ObjectId
from database.db import mongo
from models.rld_comprehension_model import RLD_Comprehension_Passage

rld_comprehension_bp = Blueprint("rld_comprehension_bp", __name__)

@rld_comprehension_bp.after_request
def add_cors(response):
    response.headers["Access-Control-Allow-Origin"]  = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST,PUT, DELETE, OPTIONS"
    return response

LEVEL_RULES = {
    "easy":   {"min_q": 1, "max_q": 2},
    "medium": {"min_q": 2, "max_q": 3},
    "hard":   {"min_q": 3, "max_q": 4},
}


# POST /api/rld_comprehension/add_passage
@rld_comprehension_bp.route("/add_passage", methods=["POST", "OPTIONS"])
@cross_origin()
def add_passage():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    try:
        data      = request.get_json()
        level     = data.get("level")
        passage   = data.get("passage")
        questions = data.get("questions")  # [{ question, options: [str,str,str,str], correct_index: int }]

        if not level or not passage or not questions:
            return jsonify({"error": "Missing level, passage, or questions"}), 400

        rules = LEVEL_RULES.get(level)
        if not rules:
            return jsonify({"error": "Invalid level. Choose easy, medium, or hard"}), 400

        if not (rules["min_q"] <= len(questions) <= rules["max_q"]):
            return jsonify({
                "error": f"{level} මට්ටමට ප්‍රශ්න {rules['min_q']}–{rules['max_q']} අතර විය යුතුය"
            }), 400

        for i, q in enumerate(questions):
            if not q.get("question"):
                return jsonify({"error": f"ප්‍රශ්නය {i + 1} හිස් ය"}), 400
            if len(q.get("options", [])) != 4:
                return jsonify({"error": f"ප්‍රශ්නය {i + 1} සඳහා හරියටම විකල්ප 4 ක් තිබිය යුතුය"}), 400
            if q.get("correct_index") not in [0, 1, 2, 3]:
                return jsonify({"error": f"ප්‍රශ්නය {i + 1} සඳහා නිවැරදි correct_index (0–3) ඇතුළු කරන්න"}), 400

        mongo.db.rld_comprehension_passages.insert_one(
            RLD_Comprehension_Passage(level, passage, questions).to_dict()
        )
        return jsonify({"message": "Passage added successfully!"})

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)}), 400


# GET /api/rld_comprehension/get_passage/<level>
@rld_comprehension_bp.route("/get_passage/<level>", methods=["GET", "OPTIONS"])
@cross_origin()
def get_passage(level):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    passages = list(mongo.db.rld_comprehension_passages.find({"level": level}))
    if not passages:
        return jsonify({"error": "No passages found for this level"}), 404

    p = random.choice(passages)

    # Strip correct_index — never sent to student
    safe_questions = [
        {
            "question": q["question"],
            "options":  q["options"],
            # correct_index intentionally NOT included
        }
        for q in p["questions"]
    ]

    return jsonify({
        "_id":       str(p["_id"]),
        "level":     p["level"],
        "passage":   p["passage"],
        "questions": safe_questions,
    })


# POST /api/rld_comprehension/check_answers
@rld_comprehension_bp.route("/check_answers", methods=["POST", "OPTIONS"])
@cross_origin()
def check_answers():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    try:
        data       = request.get_json()
        passage_id = data.get("passage_id")
        answers    = data.get("answers")   # list of ints — student's selected index per question

        p = mongo.db.rld_comprehension_passages.find_one({"_id": ObjectId(passage_id)})
        if not p:
            return jsonify({"error": "Invalid passage ID"}), 400

        correct  = 0
        results  = []
        for i, q in enumerate(p["questions"]):
            student_answer = answers[i] if i < len(answers) else None
            correct_index  = q["correct_index"]
            is_correct     = student_answer == correct_index
            if is_correct:
                correct += 1
            results.append({
                "question":      q["question"],
                "options":       q["options"],
                "correct_index": correct_index,
                "your_index":    student_answer,
                "correct":       is_correct,
            })

        total = len(p["questions"])
        return jsonify({
            "percent": round(correct / total * 100, 2) if total else 0,
            "score":   correct,
            "total":   total,
            "results": results,
        })

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)}), 400
    
@rld_comprehension_bp.route("/admin_get_passages/<level>", methods=["GET", "OPTIONS"])
@cross_origin()
def admin_get_passages(level):
    if request.method == "OPTIONS":
        return jsonify({}), 200
    passages = list(mongo.db.rld_comprehension_passages.find({"level": level}))
    results = []
    for p in passages:
        results.append({
            "_id":        str(p["_id"]),
            "level":      p["level"],
            "passage":    p["passage"],
            "questions":  p["questions"],       # includes correct_index
            "created_at": str(p.get("created_at", "")),
        })
    return jsonify(results)   

@rld_comprehension_bp.route("/delete_passage/<passage_id>", methods=["DELETE", "OPTIONS"])
@cross_origin(methods=["DELETE", "OPTIONS"])
def delete_passage(passage_id):
    if request.method == "OPTIONS":
        return jsonify({}), 200
    result = mongo.db.rld_comprehension_passages.delete_one({"_id": ObjectId(passage_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Not found"}), 404
    return jsonify({"message": "Deleted successfully"})

@rld_comprehension_bp.route("/update_passage/<passage_id>", methods=["PUT", "OPTIONS"])
@cross_origin()
def update_passage(passage_id):
    if request.method == "OPTIONS":
        return jsonify({}), 200
    try:
        data      = request.get_json()
        level     = data.get("level")
        passage   = data.get("passage")
        questions = data.get("questions")  # [{ question, options: [str,str,str,str], correct_index: int }]

        update_fields = {}
        if level:
            update_fields["level"] = level
        if passage:
            update_fields["passage"] = passage
        if questions:
            rules = LEVEL_RULES.get(level or "easy")
            for i, q in enumerate(questions):
                if len(q.get("options", [])) != 4:
                    return jsonify({"error": f"Question {i+1} must have exactly 4 options"}), 400
                if q.get("correct_index") not in [0, 1, 2, 3]:
                    return jsonify({"error": f"Question {i+1} needs a valid correct_index (0–3)"}), 400
            update_fields["questions"] = questions

        mongo.db.rld_comprehension_passages.update_one(
            {"_id": ObjectId(passage_id)},
            {"$set": update_fields}
        )
        return jsonify({"message": "Passage updated successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400