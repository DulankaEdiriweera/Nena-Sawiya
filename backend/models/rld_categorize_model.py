# models/rld_categorize_model.py
from datetime import datetime

# Level rules:
#   easy   -> 2 bags, 4 option images
#   medium -> 2 bags, 6 option images
#   hard   -> 3 bags, 8 option images

class RLD_Categorize_Set:
    def __init__(self, level, instruction, bags, options):
        self.category    = "Categorize Items - Drag Drop"
        self.level       = level
        self.instruction = instruction  # e.g. "පළතුරු බෑගයට සහ ඇඳුම් බෑගයට නිවැරදිව දමන්න"
        self.bags        = bags         # [{ label, image_url }]
        self.options     = options      # [{ image_url, correct_bag }]
        self.created_at  = datetime.utcnow()

    def to_dict(self):
        return {
            "category":    self.category,
            "level":       self.level,
            "instruction": self.instruction,
            "bags":        self.bags,
            "options":     self.options,
            "created_at":  self.created_at,
        }