from datetime import datetime

class VCModel:
    def __init__(
        self,
        answers: dict,
        times: dict,
        ml_label_en: str,
        vc_level_si: str,
        confidence: float,
        feedback: str,
        marks_level1: int,
        marks_level2: int,
        marks_level3: int,
        total_marks: int,
        final_marks_percent: float,
        rule_based_label: str,
        ml_vs_rule_mismatch: bool
    ):
        self.answers = answers
        self.times = times

        self.ml_label_en = ml_label_en
        self.vc_level = vc_level_si
        self.confidence = confidence
        self.feedback = feedback

        self.marks_level1 = marks_level1
        self.marks_level2 = marks_level2
        self.marks_level3 = marks_level3
        self.total_marks = total_marks
        self.final_marks_percent = final_marks_percent
        self.rule_based_label = rule_based_label
        self.ml_vs_rule_mismatch = ml_vs_rule_mismatch

        self.created_at = datetime.utcnow()

    def to_dict(self):
        return {
            "answers": self.answers,
            "times": self.times,

            "ml_label_en": self.ml_label_en,
            "vc_level": self.vc_level,
            "confidence": self.confidence,
            "feedback": self.feedback,

            "marks_level1": self.marks_level1,
            "marks_level2": self.marks_level2,
            "marks_level3": self.marks_level3,
            "total_marks": self.total_marks,
            "final_marks_percent": self.final_marks_percent,
            "rule_based_label": self.rule_based_label,
            "ml_vs_rule_mismatch": self.ml_vs_rule_mismatch,

            "created_at": self.created_at
        }