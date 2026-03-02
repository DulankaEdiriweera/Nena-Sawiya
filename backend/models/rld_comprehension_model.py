# models/rld_comprehension_model.py
from datetime import datetime

# Level rules:
#   easy   -> passage + 1–2 questions, 4 options each
#   medium -> passage + 2–3 questions, 4 options each
#   hard   -> passage + 3–4 questions, 4 options each

class RLD_Comprehension_Passage:
    def __init__(self, level, passage, questions):
        self.category   = "Reading Comprehension"
        self.level      = level       # "easy" | "medium" | "hard"
        self.passage    = passage     # str — the reading text (Sinhala or English)
        self.questions  = questions   # [{ question, options: [str,str,str,str], correct_index: int }]
        self.created_at = datetime.utcnow()

    def to_dict(self):
        return {
            "category":   self.category,
            "level":      self.level,
            "passage":    self.passage,
            "questions":  self.questions,
            "created_at": self.created_at,
        }