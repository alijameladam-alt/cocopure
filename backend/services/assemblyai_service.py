import httpx
from pathlib import Path

from backend.config import settings

ASSEMBLYAI_BASE = "https://api.assemblyai.com/v2"


def _headers() -> dict:
    return {"authorization": settings.assemblyai_api_key}


async def upload_file(file_path: str | Path) -> str:
    """Upload a local file to AssemblyAI and return the upload_url."""
    async with httpx.AsyncClient(timeout=600) as client:
        with open(file_path, "rb") as f:
            response = await client.post(
                f"{ASSEMBLYAI_BASE}/upload",
                headers={**_headers(), "content-type": "application/octet-stream"},
                content=f.read(),
            )
        response.raise_for_status()
        return response.json()["upload_url"]


async def submit_transcription(upload_url: str) -> str:
    """Submit a transcription job and return the job_id."""
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            f"{ASSEMBLYAI_BASE}/transcript",
            headers={**_headers(), "content-type": "application/json"},
            json={"audio_url": upload_url},
        )
        response.raise_for_status()
        return response.json()["id"]


async def get_transcription_status(job_id: str) -> dict:
    """Return the current status and transcript (if completed)."""
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.get(
            f"{ASSEMBLYAI_BASE}/transcript/{job_id}",
            headers=_headers(),
        )
        response.raise_for_status()
        data = response.json()
        return {
            "job_id": job_id,
            "status": data.get("status"),
            "transcript": data.get("text"),
            "error": data.get("error"),
        }
