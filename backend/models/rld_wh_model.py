# models/rld_wh_model.py
from datetime import datetime

# WH Question Game — Pure Audio + Text MCQ (no images at all)
#
# Admin uploads:
#   - scene_audio_url    : audio describing the scene
#   - question_audio_url : audio of the WH question
#   - question_text      : Sinhala text subtitle of the question
#   - wh_type            : කවුද | කොහේ | මොකද | කවදා | ඇයි
#   - options            : [{ text }] — 4 Sinhala text answers
#   - correct_index      : 0-3

class RLD_WH_Question:
    def __init__(self, level, wh_type, scene_audio_url,
                 question_audio_url, question_text, options, correct_index):
        self.category           = "WH Questions"
        self.level              = level
        self.wh_type            = wh_type
        self.scene_audio_url    = scene_audio_url
        self.question_audio_url = question_audio_url
        self.question_text      = question_text
        self.options            = options      # [{ text }]
        self.correct_index      = correct_index
        self.created_at         = datetime.utcnow()

    def to_dict(self):
        return {
            "category":           self.category,
            "level":              self.level,
            "wh_type":            self.wh_type,
            "scene_audio_url":    self.scene_audio_url,
            "question_audio_url": self.question_audio_url,
            "question_text":      self.question_text,
            "options":            self.options,
            "correct_index":      self.correct_index,
            "created_at":         self.created_at,
        }