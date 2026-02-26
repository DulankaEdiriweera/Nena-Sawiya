from datetime import datetime

class PictureMCQModel:
    def __init__(self, level, image_url, question, options, correct_answer, task_number):
        self.level = level.upper()              # EASY, MEDIUM, HARD
        self.image_url = image_url               # path to uploaded image
        self.question = question                 # question related to the image
        self.options = options                   # list of answer options
        self.correct_answer = correct_answer     # correct answer string
        self.task_number = task_number           # 1,2,3,... for ordering
        self.created_at = datetime.utcnow()      # timestamp of creation

    def to_dict(self):
        return {
            "level": self.level,
            "image_url": self.image_url,
            "question": self.question,
            "options": self.options,
            "correct_answer": self.correct_answer,
            "task_number": self.task_number,
            "created_at": self.created_at
        }