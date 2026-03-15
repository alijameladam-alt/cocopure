import uuid

from fastapi import APIRouter, HTTPException, Header
from fastapi.responses import RedirectResponse
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired

from backend.config import settings
from backend.models.schemas import (
    LinkedInProfileResponse,
    LinkedInPublishRequest,
    LinkedInPublishResponse,
)
from backend.services import linkedin_service

router = APIRouter()

_serializer = URLSafeTimedSerializer(settings.secret_key, salt="linkedin-oauth-state")
STATE_MAX_AGE = 900  # 15 minutes


@router.get("/linkedin/auth")
async def linkedin_auth():
    raw_state = str(uuid.uuid4())
    signed_state = _serializer.dumps(raw_state)
    auth_url = linkedin_service.get_auth_url(state=signed_state)
    return RedirectResponse(url=auth_url)


@router.get("/linkedin/callback")
async def linkedin_callback(code: str, state: str):
    try:
        _serializer.loads(state, max_age=STATE_MAX_AGE)
    except SignatureExpired:
        raise HTTPException(status_code=400, detail="OAuth state expired. Please try again.")
    except BadSignature:
        raise HTTPException(status_code=400, detail="Invalid OAuth state.")

    try:
        access_token = await linkedin_service.exchange_code_for_token(code)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Token exchange failed: {exc}")

    # Pass the token to the frontend via query param (frontend stores in memory only)
    redirect_url = f"{settings.frontend_url}/publish?token={access_token}"
    return RedirectResponse(url=redirect_url)


@router.get("/linkedin/profile", response_model=LinkedInProfileResponse)
async def linkedin_profile(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Bearer token required.")
    token = authorization.removeprefix("Bearer ")
    try:
        profile = await linkedin_service.get_user_profile(token)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc))
    return LinkedInProfileResponse(**profile)


@router.post("/linkedin/publish", response_model=LinkedInPublishResponse)
async def linkedin_publish(request: LinkedInPublishRequest):
    try:
        result = await linkedin_service.publish_post(
            access_token=request.access_token,
            linkedin_id=request.linkedin_id,
            post_text=request.linkedin_post,
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc))
    return LinkedInPublishResponse(**result)
