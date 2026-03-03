"""
VD Picture MCQ Model
Collection: vd_picture_mcq_questions

Schema:
{
    "_id": ObjectId (auto),
    "level": str,          # "EASY" | "MEDIUM" | "HARD"
    "task_number": int,
    "question_text": str,
    "question_image": str, # relative URL e.g. /vd_uploads/filename.jpg
    "answers": [
        {
            "image_url": str,  # relative URL
            "mark": int        # mark value (>0 for correct, 0 for wrong)
        },
        ... (5 total)
    ],
    "created_at": datetime
}
"""

from database.db import mongo
from bson import ObjectId
from datetime import datetime


def serialize_question(q):
    """Convert MongoDB document to JSON-serializable dict."""
    q["_id"] = str(q["_id"])
    return q


def get_all_questions():
    questions = list(mongo.db.vd_picture_mcq_questions.find())
    return [serialize_question(q) for q in questions]


def get_questions_by_level(level: str):
    questions = list(
        mongo.db.vd_picture_mcq_questions.find({"level": level.upper()})
    )
    return [serialize_question(q) for q in questions]


def get_question_by_id(question_id: str):
    q = mongo.db.vd_picture_mcq_questions.find_one({"_id": ObjectId(question_id)})
    if q:
        return serialize_question(q)
    return None


def update_question(question_id: str, update_data: dict):
    result = mongo.db.vd_picture_mcq_questions.update_one(
        {"_id": ObjectId(question_id)},
        {"$set": {**update_data, "updated_at": datetime.utcnow()}}
    )
    return result.modified_count > 0


def delete_question(question_id: str):
    result = mongo.db.vd_picture_mcq_questions.delete_one({"_id": ObjectId(question_id)})
    return result.deleted_count > 0

