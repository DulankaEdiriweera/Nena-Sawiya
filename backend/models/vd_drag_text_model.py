from datetime import datetime


def vd_drag_item_schema(image_url, group, mark):
    """Schema for each draggable image item."""
    return {
        "image_url": image_url,   # e.g. "/vd_uploads/filename.png"
        "group": group,           # must match one of the targets
        "mark": int(mark)         # points for correct match
    }


def vd_drag_text_schema(instruction, level, targets, items):
    """Schema for a full VD drag & drop activity document."""
    return {
        "instruction": instruction,          # string shown to user
        "level": level.upper(),              # "EASY" | "MEDIUM" | "HARD"
        "targets": targets,                  # list of target labels e.g. ["A", "B", "3"]
        "items": items,                      # list of vd_drag_item_schema dicts
        "created_at": datetime.utcnow()
    }

