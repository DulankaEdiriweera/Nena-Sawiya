from datetime import datetime

class VCJigsawModel:
    def __init__(self, title, ability_levels, rows, cols, puzzle_id,
                 original_url, pieces,
                 task_number=None, original_w=None, original_h=None, tile_w=None, tile_h=None):
        self.title = title
        self.ability_levels = ability_levels
        self.rows = rows
        self.cols = cols
        self.puzzle_id = puzzle_id

        # IMPORTANT: original_url should point to the PROCESSED BASE image (not raw upload)
        self.original_url = original_url

        self.pieces = pieces  # list of {index,row,col,url}
        self.task_number = task_number
        self.original_w = original_w
        self.original_h = original_h
        self.tile_w = tile_w
        self.tile_h = tile_h
        self.created_at = datetime.utcnow()

    def to_dict(self):
        return {
            "title": self.title,
            "ability_levels": self.ability_levels,
            "rows": self.rows,
            "cols": self.cols,
            "puzzle_id": self.puzzle_id,
            "original_url": self.original_url,
            "pieces": self.pieces,
            "task_number": self.task_number,
            "original_w": self.original_w,
            "original_h": self.original_h,
            "tile_w": self.tile_w,
            "tile_h": self.tile_h,
            "created_at": self.created_at
        }