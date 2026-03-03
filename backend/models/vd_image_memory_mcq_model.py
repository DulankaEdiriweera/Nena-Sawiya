from datetime import datetime


def vd_mcq_item_schema(question, options, correct, mark):
    """
    Schema for a single MCQ item.
    - question: str
    - options: list of strings (min 2)
    - correct: int, index of correct option
    - mark: int, points awarded for correct answer
    """
    return {
        "question": str(question).strip(),
        "options": [str(o).strip() for o in options],
        "correct": int(correct),
        "mark": int(mark)
    }


def vd_mcq_schema(title, level, image_url, questions):
    """
    Schema for a full VD Memory MCQ game document.
    - title: str
    - level: str — "EASY", "MEDIUM", or "HARD"
    - image_url: str — e.g. "/vd_uploads/filename.png"
    - questions: list of vd_mcq_item_schema dicts
    """
    return {
        "title": str(title).strip(),
        "level": str(level).upper(),
        "image_url": str(image_url),
        "questions": [
            vd_mcq_item_schema(
                q["question"],
                q["options"],
                q["correct"],
                q["mark"]
            )
            for q in questions
        ],
        "created_at": datetime.utcnow()
    }

