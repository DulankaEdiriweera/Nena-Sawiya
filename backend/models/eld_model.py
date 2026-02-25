from datetime import datetime

class ELDModel:
    def __init__(self, story1, story2, story3, story4,
                 overall_percentage, eld_level, feedback):

        self.story1 = story1
        self.story2 = story2
        self.story3 = story3
        self.story4 = story4
        self.overall_percentage = overall_percentage
        self.eld_level = eld_level
        self.feedback = feedback
        self.created_at = datetime.utcnow()

    def to_dict(self):
        return {
            "story1": self.story1,
            "story2": self.story2,
            "story3": self.story3,
            "story4": self.story4,
            "overall_percentage": self.overall_percentage,
            "eld_level": self.eld_level,
            "feedback": self.feedback,
            "created_at": self.created_at
        }