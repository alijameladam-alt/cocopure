import httpx

from backend.config import settings

LINKEDIN_AUTH_URL = "https://www.linkedin.com/oauth/v2/authorization"
LINKEDIN_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken"
LINKEDIN_USERINFO_URL = "https://api.linkedin.com/v2/userinfo"
LINKEDIN_UGC_URL = "https://api.linkedin.com/v2/ugcPosts"

SCOPES = "openid profile w_member_social"


def get_auth_url(state: str) -> str:
    params = (
        f"response_type=code"
        f"&client_id={settings.linkedin_client_id}"
        f"&redirect_uri={settings.linkedin_redirect_uri}"
        f"&scope={SCOPES.replace(' ', '%20')}"
        f"&state={state}"
    )
    return f"{LINKEDIN_AUTH_URL}?{params}"


async def exchange_code_for_token(code: str) -> str:
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            LINKEDIN_TOKEN_URL,
            data={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": settings.linkedin_redirect_uri,
                "client_id": settings.linkedin_client_id,
                "client_secret": settings.linkedin_client_secret,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        response.raise_for_status()
        return response.json()["access_token"]


async def get_user_profile(access_token: str) -> dict:
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.get(
            LINKEDIN_USERINFO_URL,
            headers={"Authorization": f"Bearer {access_token}"},
        )
        response.raise_for_status()
        data = response.json()
        return {
            "linkedin_id": data.get("sub"),
            "name": data.get("name", ""),
            "profile_picture": data.get("picture"),
        }


async def publish_post(access_token: str, linkedin_id: str, post_text: str) -> dict:
    payload = {
        "author": f"urn:li:person:{linkedin_id}",
        "lifecycleState": "PUBLISHED",
        "specificContent": {
            "com.linkedin.ugc.ShareContent": {
                "shareCommentary": {"text": post_text},
                "shareMediaCategory": "NONE",
            }
        },
        "visibility": {"com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"},
    }
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            LINKEDIN_UGC_URL,
            json=payload,
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
                "X-Restli-Protocol-Version": "2.0.0",
            },
        )
        response.raise_for_status()
        post_id = response.json().get("id", "")
        # Construct a best-effort URL; LinkedIn doesn't return a direct URL
        post_url = f"https://www.linkedin.com/feed/update/{post_id}/"
        return {"post_id": post_id, "post_url": post_url}
