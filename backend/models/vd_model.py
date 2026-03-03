from datetime import datetime

class VDModel:
    """
    Model to store a visual discrimination assessment in MongoDB.
    Stores input marks, predicted level, advice, timestamp,
    and a unique assessment hash to prevent duplicates.
    """
    def __init__(self, input_marks, predicted_level, advice=None, assessment_hash=None):
        self.input_marks = input_marks          # Original input payload
        self.predicted_level = predicted_level  # e.g., "දුර්වල"
        self.advice = advice                    # Separate advice message
        self.assessment_hash = assessment_hash  # ✅ NEW (for duplicate prevention)
        self.created_at = datetime.utcnow()     # Timestamp

    def to_dict(self):
        return {
            "input_marks": self.input_marks,
            "predicted_level": self.predicted_level,
            "advice": self.advice,
            "assessment_hash": self.assessment_hash,  # ✅ NEW
            "created_at": self.created_at
        }