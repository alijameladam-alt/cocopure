import os
import uuid
from pathlib import Path

from backend.config import settings


def ensure_upload_dir() -> Path:
    path = Path(settings.upload_temp_dir)
    path.mkdir(parents=True, exist_ok=True)
    return path


def get_temp_path(filename: str) -> Path:
    upload_dir = ensure_upload_dir()
    safe_name = f"{uuid.uuid4()}_{Path(filename).name}"
    return upload_dir / safe_name


def delete_file(path: str | Path) -> None:
    try:
        os.remove(path)
    except OSError:
        pass
