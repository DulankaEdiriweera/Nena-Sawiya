from datetime import datetime

class StoryClozeModel:
    def __init__(self, title, text_with_blanks, blanks_answers, options, video_url, task_number=None):
        self.title = title                                # Story title
        self.text_with_blanks = text_with_blanks          # Text with blanks like "I ____ to school"
        self.blanks_answers = blanks_answers              # List of correct words for blanks
        self.options = options                            # List of words for drag-and-drop
        self.video_url = video_url                        # Path to uploaded video
        self.task_number = task_number                    # Optional task number
        self.created_at = datetime.utcnow()               # Timestamp

    def to_dict(self):
        return {
            "title": self.title,
            "text_with_blanks": self.text_with_blanks,
            "blanks_answers": self.blanks_answers,
            "options": self.options,
            "video_url": self.video_url,
            "task_number": self.task_number,
            "created_at": self.created_at
        }