from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse

from backend.config import settings
from backend.models.schemas import UploadResponse
from backend.services import assemblyai_service
from backend.utils.file_utils import get_temp_path, delete_file

router = APIRouter()

ALLOWED_MIME_PREFIXES = ("video/", "audio/")


@router.post("/upload", response_model=UploadResponse)
async def upload_video(file: UploadFile = File(...)):
    content_type = file.content_type or ""
    if not any(content_type.startswith(p) for p in ALLOWED_MIME_PREFIXES):
        raise HTTPException(status_code=400, detail="Only video or audio files are accepted.")

    temp_path = get_temp_path(file.filename or "upload")
    try:
        # Stream to disk in chunks to handle large files
        with open(temp_path, "wb") as f:
            size = 0
            chunk_size = 1024 * 1024  # 1 MB
            while True:
                chunk = await file.read(chunk_size)
                if not chunk:
                    break
                size += len(chunk)
                if size > settings.max_upload_size_bytes:
                    raise HTTPException(
                        status_code=413,
                        detail=f"File exceeds maximum size of {settings.max_upload_size_mb} MB.",
                    )
                f.write(chunk)

        upload_url = await assemblyai_service.upload_file(temp_path)
        job_id = await assemblyai_service.submit_transcription(upload_url)
    finally:
        delete_file(temp_path)

    return UploadResponse(job_id=job_id, status="queued")
