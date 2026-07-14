"""
Image compression service using Pillow.

Quality mode:  compress with the given quality value (1–100).
Target mode:   binary search over quality values until output ≤ target_size_kb.
"""

import io
from PIL import Image

# MIME → Pillow format string + save kwargs
_FORMAT_MAP = {
    "image/jpeg": ("JPEG", {"optimize": True}),
    "image/png":  ("PNG",  {"optimize": True}),
}


def compress(
    path: str,
    content_type: str,
    mode: str,
    quality: int,
    target_size_kb: int,
) -> bytes:
    fmt, base_kwargs = _FORMAT_MAP.get(content_type, ("JPEG", {"optimize": True}))

    with Image.open(path) as img:
        # Convert palette/RGBA images to RGB for JPEG compatibility
        if fmt == "JPEG" and img.mode not in ("RGB", "L"):
            img = img.convert("RGB")

        if mode == "quality":
            return _save(img, fmt, quality=quality, **base_kwargs)

        # targetSize mode: binary search
        return _binary_search(img, fmt, target_size_kb, base_kwargs)


def _save(img: Image.Image, fmt: str, **kwargs) -> bytes:
    buf = io.BytesIO()
    img.save(buf, format=fmt, **kwargs)
    return buf.getvalue()


def _binary_search(
    img: Image.Image,
    fmt: str,
    target_kb: int,
    base_kwargs: dict,
) -> bytes:
    target_bytes = target_kb * 1024

    if fmt == "PNG":
        # PNG is lossless — just return at max compression
        return _save(img, fmt, compress_level=9, **base_kwargs)

    lo, hi = 1, 95
    best = _save(img, fmt, quality=hi, **base_kwargs)

    for _ in range(8):  # max 8 iterations (precision: ~1%)
        mid = (lo + hi) // 2
        candidate = _save(img, fmt, quality=mid, **base_kwargs)
        if len(candidate) <= target_bytes:
            best = candidate
            lo = mid + 1
        else:
            hi = mid - 1
        if lo > hi:
            break

    return best
