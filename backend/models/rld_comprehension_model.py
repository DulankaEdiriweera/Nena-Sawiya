from datetime import datetime

class RLD_Comprehension_Passage:
    def __init__(self, level, passage, questions, audio_url=None):
        self.category    = "Reading Comprehension"
        self.level       = level
        self.passage     = passage
        self.questions   = questions
        self.audio_url   = audio_url  
        self.created_at  = datetime.utcnow()

    def to_dict(self):
        return {
            "category":   self.category,
            "level":      self.level,
            "passage":    self.passage,
            "questions":  self.questions,
            "audio_url":  self.audio_url,
            "created_at": self.created_at,
        }