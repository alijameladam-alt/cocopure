from pydantic import BaseModel
from typing import Optional


class UploadResponse(BaseModel):
    job_id: str
    status: str = "queued"


class TranscriptionStatusResponse(BaseModel):
    job_id: str
    status: str  # queued | processing | completed | error
    transcript: Optional[str] = None
    error: Optional[str] = None


class GenerateRequest(BaseModel):
    transcript: str
    tone: str = "professional"  # professional | casual | inspiring


class GenerateResponse(BaseModel):
    summary: str
    linkedin_post: str
    word_count: int
    word_count_warning: bool = False


class LinkedInProfileResponse(BaseModel):
    linkedin_id: str
    name: str
    profile_picture: Optional[str] = None


class LinkedInPublishRequest(BaseModel):
    linkedin_post: str
    linkedin_id: str
    access_token: str


class LinkedInPublishResponse(BaseModel):
    post_id: str
    post_url: str
