import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from database.db import mongo
from datetime import datetime
from models.eld_storyClozeModel import StoryClozeModel

story_bp = Blueprint("story_bp", __name__)

# Add a new story with video
@story_bp.route("/add", methods=["POST"])
def add_story():
    title = request.form.get("title")
    text_with_blanks = request.form.get("text_with_blanks")
    blanks_answers = request.form.getlist("blanks_answers[]")  # list of correct words
    options = request.form.getlist("options[]")                # list of draggable words
    task_number = request.form.get("task_number")

    video = request.files.get("video")
    if not video:
        return jsonify({"error": "No video uploaded"}), 400

    os.makedirs(current_app.config['UPLOAD_FOLDER'], exist_ok=True)
    filename = secure_filename(video.filename)
    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    video.save(filepath)

    video_url = f"/uploads/{filename}"  # frontend will access via this path

    story = StoryClozeModel(
        title=title,
        text_with_blanks=text_with_blanks,
        blanks_answers=blanks_answers,
        options=options,
        video_url=video_url,
        task_number=int(task_number) if task_number else None
    )

    mongo.db.story_cloze.insert_one(story.to_dict())
    return jsonify({"message": "Story added successfully"})


# Get all stories
@story_bp.route("/all", methods=["GET"])
def get_all_stories():
    stories = list(mongo.db.story_cloze.find({}, {"_id": 0}))
    return jsonify(stories)