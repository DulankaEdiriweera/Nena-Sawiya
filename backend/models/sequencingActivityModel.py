from datetime import datetime

class SequencingActivityModel:
    def __init__(self, level, title, images, correct_order, task_number):
        self.level = level.upper()          # EASY, MEDIUM, HARD
        self.title = title                  # Activity title (e.g., Going to School)
        self.images = images                # List of image objects [{id:1, url:"..."}, ...]
        self.correct_order = correct_order  # Correct order list [1,2,3,4]
        self.task_number = task_number      # 1,2,3,... ordering within level
        self.created_at = datetime.utcnow() # Timestamp

    def to_dict(self):
        return {
            "level": self.level,
            "title": self.title,
            "images": self.images,
            "correct_order": self.correct_order,
            "task_number": self.task_number,
            "created_at": self.created_at
        }