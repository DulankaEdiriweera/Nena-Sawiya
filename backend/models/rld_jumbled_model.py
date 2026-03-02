# models/rld_jumbled_model.py
from datetime import datetime

class RLD_Jumbled_Set:
    def __init__(self, level, instructions, words):
        self.category = "Jumbled Words"
        self.level = level
        self.instructions = instructions
        self.words = words
        self.created_at = datetime.utcnow()

    def to_dict(self):
        return {
            "category": self.category,
            "level": self.level,
            "instructions": self.instructions,
            "words": self.words,
            "created_at": self.created_at
        }