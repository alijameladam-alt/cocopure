import json
import re

import anthropic

from backend.config import settings

MODEL = "claude-sonnet-4-6"

SYSTEM_PROMPT = """You are an expert LinkedIn content creator. Given a video transcript, produce a JSON object with exactly two keys:
  "summary": a 3-5 sentence executive summary of the content
  "linkedin_post": a {tone} LinkedIn article of 300-500 words that educates and engages professionals. Include a hook opening line, 3-4 key insights from the content, and a closing call-to-action question.
Return ONLY valid JSON with no markdown fences, no extra text."""


def _count_words(text: str) -> int:
    return len(re.findall(r"\S+", text))


def _parse_response(content: str) -> dict:
    # Strip markdown fences if Claude includes them despite instructions
    content = re.sub(r"^```(?:json)?\s*", "", content.strip())
    content = re.sub(r"\s*```$", "", content)
    return json.loads(content)


async def generate_linkedin_post(transcript: str, tone: str = "professional") -> dict:
    client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)
    system = SYSTEM_PROMPT.replace("{tone}", tone)

    response = await client.messages.create(
        model=MODEL,
        max_tokens=1024,
        system=system,
        messages=[{"role": "user", "content": f"Transcript:\n\n{transcript}"}],
    )

    raw = response.content[0].text
    result = _parse_response(raw)
    word_count = _count_words(result["linkedin_post"])
    word_count_warning = False

    if not (300 <= word_count <= 500):
        retry_response = await client.messages.create(
            model=MODEL,
            max_tokens=1024,
            system=system,
            messages=[
                {"role": "user", "content": f"Transcript:\n\n{transcript}"},
                {"role": "assistant", "content": raw},
                {
                    "role": "user",
                    "content": (
                        f"Your previous linkedin_post was {word_count} words. "
                        "Rewrite the full JSON so the linkedin_post is strictly between 300 and 500 words."
                    ),
                },
            ],
        )
        raw = retry_response.content[0].text
        result = _parse_response(raw)
        word_count = _count_words(result["linkedin_post"])
        if not (300 <= word_count <= 500):
            word_count_warning = True

    return {
        "summary": result["summary"],
        "linkedin_post": result["linkedin_post"],
        "word_count": word_count,
        "word_count_warning": word_count_warning,
    }
