from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.config import settings
from backend.routers import upload, transcription, generation, linkedin

app = FastAPI(title="Video to LinkedIn Post")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api")
app.include_router(transcription.router, prefix="/api")
app.include_router(generation.router, prefix="/api")
app.include_router(linkedin.router, prefix="/api")


@app.get("/health")
async def health():
    return {"status": "ok"}
