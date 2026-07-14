from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from routers import compress

load_dotenv()

app = FastAPI(
    title="Squish API",
    description="Privacy-first file compression API. Files are never stored — temp files are deleted immediately after the response.",
    version="2.0.0",
)

# CORS — restrict to your frontend domain in production.
# Set ALLOWED_ORIGINS in .env (comma-separated) or fall back to localhost for dev.
_raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:4173")
allowed_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

app.include_router(compress.router)


@app.get("/health")
def health():
    return {"status": "ok"}
