from fastapi import APIRouter, HTTPException

from backend.models.schemas import TranscriptionStatusResponse
from backend.services import assemblyai_service

router = APIRouter()


@router.get("/transcription/{job_id}", response_model=TranscriptionStatusResponse)
async def get_transcription_status(job_id: str):
    try:
        result = await assemblyai_service.get_transcription_status(job_id)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc))
    return TranscriptionStatusResponse(**result)
