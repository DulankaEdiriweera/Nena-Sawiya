from datetime import datetime

def vd_count_item_schema(label, image_url, correct_answer, mark):
    return {
        "label": label,
        "image_url": image_url,
        "correct_answer": int(correct_answer),
        "mark": int(mark)
    }

def vd_count_game_schema(title, level, question_image_url, items):
    return {
        "title": title,
        "level": level.upper(),
        "question_image_url": question_image_url,
        "items": items,
        "created_at": datetime.utcnow()
    }
