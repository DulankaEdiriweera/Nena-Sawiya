from datetime import datetime

class RLD_Direction_Set:

    def __init__(self, easy, medium, hard):

        self.category = "Identify Direction"
        self.easy = easy
        self.medium = medium
        self.hard = hard
        self.created_at = datetime.utcnow()

    def to_dict(self):
        return {
            "category": self.category,
            "easy": self.easy,
            "medium": self.medium,
            "hard": self.hard,
            "created_at": self.created_at
        }