"""
Utility helpers for temp file management.
The compress router handles its own cleanup via try/finally,
but these helpers are available for future use.
"""

import os


def safe_delete(path: str | None) -> None:
    """Delete a file if it exists. Never raises."""
    try:
        if path and os.path.exists(path):
            os.remove(path)
    except OSError:
        pass
