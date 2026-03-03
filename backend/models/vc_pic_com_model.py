from datetime import datetime

class VCPicComModel:
    def __init__(
        self,
        title,
        levels,              # ["easy"] / ["medium"] / ["hard"]
        rows,
        cols,
        activity_id,
        original_url,
        question_url,
        missing_index,
        correct_piece,       # {index,row,col,url,thumb_url}
        options,             # list {id,index,url,thumb_url,is_correct}
        task_number=None
    ):
        self.title = title
        self.levels = levels
        self.rows = rows
        self.cols = cols
        self.activity_id = activity_id
        self.original_url = original_url
        self.question_url = question_url
        self.missing_index = missing_index
        self.correct_piece = correct_piece
        self.options = options
        self.task_number = task_number
        self.created_at = datetime.utcnow()

    def to_dict(self):
        return {
            "title": self.title,
            "levels": self.levels,
            "rows": self.rows,
            "cols": self.cols,
            "activity_id": self.activity_id,
            "original_url": self.original_url,
            "question_url": self.question_url,
            "missing_index": self.missing_index,
            "correct_piece": self.correct_piece,
            "options": self.options,
            "task_number": self.task_number,
            "created_at": self.created_at
        }