import os
import tempfile
from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import StreamingResponse

from services import image_compressor, pdf_compressor, docx_compressor

router = APIRouter()

SUPPORTED_TYPES = {
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}


def _suffix(filename: str) -> str:
    return Path(filename).suffix or ".bin"


@router.post("/compress")
async def compress(
    file: UploadFile = File(...),
    mode: str = Form("quality"),          # "quality" | "targetSize"
    quality: int = Form(75),              # 1–100
    targetSizeKB: int = Form(500),        # target size in KB
):
    """
    Compress an uploaded file and stream the result back.
    The temporary file on disk is ALWAYS deleted in the finally block —
    nothing is ever stored beyond the duration of this request.
    """
    content_type = file.content_type or ""

    if content_type not in SUPPORTED_TYPES:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type: {content_type}. "
                   "Accepted: JPEG, PNG, PDF, DOCX.",
        )

    tmp_path: str | None = None

    try:
        # Write upload to a named temp file (delete=False so we control deletion)
        suffix = _suffix(file.filename or "upload")
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        # Route to the correct service
        if content_type in ("image/jpeg", "image/png"):
            result_bytes = image_compressor.compress(
                tmp_path,
                content_type=content_type,
                mode=mode,
                quality=quality,
                target_size_kb=targetSizeKB,
            )
        elif content_type == "application/pdf":
            result_bytes = pdf_compressor.compress(tmp_path)
        else:
            result_bytes = docx_compressor.compress(
                tmp_path,
                quality=quality,
            )

        # Stream response — client receives the bytes, nothing is buffered to disk
        return StreamingResponse(
            iter([result_bytes]),
            media_type=content_type,
            headers={
                "Content-Disposition": f'attachment; filename="squished_{file.filename}"',
                "X-Original-Size": str(os.path.getsize(tmp_path)),
                "X-Compressed-Size": str(len(result_bytes)),
            },
        )

    finally:
        # Zero-storage guarantee: always delete the temp file
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)
