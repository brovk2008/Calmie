import os
import sys
from pathlib import Path

# Add backend directory and parent directory to sys.path
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))
if str(backend_dir.parent) not in sys.path:
    sys.path.insert(0, str(backend_dir.parent))

try:
    from .main import app
except (ImportError, ValueError):
    from main import app

__all__ = ["app"]
