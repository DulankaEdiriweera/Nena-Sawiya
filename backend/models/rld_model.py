from datetime import datetime

class RLDModel:
    def __init__(self, answers,
                 overall_percentage,
                 rld_level,
                 feedback):

        self.answers = answers
        self.overall_percentage = overall_percentage
        self.rld_level = rld_level
        self.feedback = feedback
        self.created_at = datetime.utcnow()

    def to_dict(self):
        return {
         "answers": self.answers,
         "Percentage": self.overall_percentage,
         "RLD_level": self.rld_level,
         "Feedback": self.feedback,
         "created_at": self.created_at
    }