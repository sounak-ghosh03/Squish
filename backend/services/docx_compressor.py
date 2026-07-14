"""
DOCX compression service using python-docx + Pillow.

Strategy:
- Open the DOCX file (which is a ZIP archive)
- Find all embedded images in the media/ folder
- Re-encode each with Pillow at reduced quality
- Save the result as a new DOCX bytes object

python-docx doesn't expose direct image replacement easily, so we
manipulate the underlying ZIP structure via zipfile directly.
"""

import io
import zipfile
from PIL import Image


# Image extensions we attempt to recompress
_IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".tif", ".webp"}


def compress(path: str, quality: int = 75) -> bytes:
    output = io.BytesIO()

    with zipfile.ZipFile(path, "r") as zin, zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            lower = item.filename.lower()

            # Check if this entry is an image in the media folder
            is_image = (
                lower.startswith("word/media/") and
                any(lower.endswith(ext) for ext in _IMAGE_EXTS)
            )

            if is_image:
                data = _recompress_image(data, lower, quality)

            # Write entry — use ZIP_STORED for already-compressed items to avoid double-compression
            compress_type = zipfile.ZIP_DEFLATED if not lower.endswith((".png", ".jpg", ".jpeg")) else zipfile.ZIP_STORED
            zout.writestr(item, data, compress_type=compress_type)

    return output.getvalue()


def _recompress_image(data: bytes, filename: str, quality: int) -> bytes:
    try:
        img = Image.open(io.BytesIO(data))

        if filename.endswith(".png"):
            # Keep as PNG (lossless) but optimize
            buf = io.BytesIO()
            if img.mode == "RGBA":
                img.save(buf, format="PNG", optimize=True)
            else:
                img.save(buf, format="PNG", optimize=True)
            result = buf.getvalue()
        else:
            # Convert to JPEG
            if img.mode not in ("RGB", "L"):
                img = img.convert("RGB")
            buf = io.BytesIO()
            img.save(buf, format="JPEG", quality=quality, optimize=True)
            result = buf.getvalue()

        # Only use compressed version if it's actually smaller
        return result if len(result) < len(data) else data

    except Exception:
        # Return original bytes if we can't recompress
        return data
