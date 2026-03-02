# models/rld_direction_model.py
from datetime import datetime

# Zone positions used by the game layout
# easy   -> 2 zones: left, right
# medium -> 3 zones: left, right, top
# hard   -> 4 zones: left, right, top, bottom

class RLD_Direction_Set:
    def __init__(self, level, scene_image_url, question, options):
        self.category        = "Identify Direction - Drag Drop"
        self.level           = level            # "easy" | "medium" | "hard"
        self.scene_image_url = scene_image_url
        self.question        = question
        self.options         = options          # [{ image_url, correct_zone }]
        self.created_at      = datetime.utcnow()

    def to_dict(self):
        return {
            "category":        self.category,
            "level":           self.level,
            "scene_image_url": self.scene_image_url,
            "question":        self.question,
            "options":         self.options,
            "created_at":      self.created_at,
        }