from datetime import datetime

class VCShaMatModel:
    def __init__(
        self,
        title,
        levels,             # ["easy"] or ["easy","medium"] etc.
        activity_id,
        original_url,       # correct full image
        shadow_url,         # generated shadow image
        options,            # list of {id, url, is_correct}
        task_number=None
    ):
        self.title = title
        self.levels = levels
        self.activity_id = activity_id
        self.original_url = original_url
        self.shadow_url = shadow_url
        self.options = options
        self.task_number = task_number
        self.created_at = datetime.utcnow()

    def to_dict(self):
        return {
            "title": self.title,
            "levels": self.levels,
            "activity_id": self.activity_id,
            "original_url": self.original_url,
            "shadow_url": self.shadow_url,
            "options": self.options,
            "task_number": self.task_number,
            "created_at": self.created_at
        }