"""
PDF compression service using pikepdf.

Strategy:
- Open with pikepdf
- Re-save with stream compression + object stream packing (handles text/vector)
- Downsample oversized embedded raster images via Pillow

Note: vector graphics and text are unchanged — only raster XObjects are touched.
"""

import io
import pikepdf
from PIL import Image


def compress(path: str) -> bytes:
    with pikepdf.open(path, suppress_warnings=True) as pdf:
        _downsample_images(pdf)

        buf = io.BytesIO()
        pdf.save(
            buf,
            compress_streams=True,
            object_stream_mode=pikepdf.ObjectStreamMode.generate,
            recompress_flate=True,
        )
        return buf.getvalue()


def _downsample_images(pdf: pikepdf.Pdf, max_dimension: int = 1920) -> None:
    """Re-encode oversized raster images embedded in the PDF at reduced quality."""
    for page in pdf.pages:
        resources = page.get("/Resources")
        if resources is None:
            continue

        xobjects = resources.get("/XObject")
        if xobjects is None:
            continue

        for key in list(xobjects.keys()):
            xobj = xobjects[key]
            try:
                if xobj.get("/Subtype") != "/Image":
                    continue

                width = int(xobj["/Width"])
                height = int(xobj["/Height"])

                if max(width, height) <= max_dimension:
                    continue  # Already small enough — skip

                # Read the raw compressed bytes and decode via Pillow
                raw = bytes(xobj.read_raw_bytes())
                img = Image.open(io.BytesIO(raw))
                if img.mode not in ("RGB", "L"):
                    img = img.convert("RGB")

                scale = max_dimension / max(width, height)
                new_w = max(1, int(width * scale))
                new_h = max(1, int(height * scale))
                img = img.resize((new_w, new_h), Image.LANCZOS)

                buf = io.BytesIO()
                img.save(buf, format="JPEG", quality=75, optimize=True)
                new_bytes = buf.getvalue()

                # Replace stream data using pikepdf's correct API
                xobj.stream_data = new_bytes
                xobj["/Width"] = pikepdf.Integer(new_w)
                xobj["/Height"] = pikepdf.Integer(new_h)
                xobj["/Filter"] = pikepdf.Name("/DCTDecode")
                xobj["/ColorSpace"] = pikepdf.Name("/DeviceRGB")
                # Remove any existing decode parms that conflict with JPEG
                if "/DecodeParms" in xobj:
                    del xobj["/DecodeParms"]

            except Exception:
                # Skip unprocessable images — never fail the whole compress
                continue
