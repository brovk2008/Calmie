import os
import sys
import logging
import traceback
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))
if str(backend_dir.parent) not in sys.path:
    sys.path.insert(0, str(backend_dir.parent))

# 1. Initialize core FastAPI app immediately so Vercel can always bind the handler
app = FastAPI(
    title="Calmie API",
    description="Calmie Voice AI & Senior Check-in Platform Backend",
    version="1.0.0"
)

# Enable CORS for frontend development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Safely import settings
try:
    from config import settings
except Exception:
    try:
        from .config import settings
    except Exception:
        class DummySettings:
            APP_NAME = "Calmie API"
            ENV = "production"
            BASE_URL = "https://calmie-lol.vercel.app"
            SUPABASE_URL = ""
            SUPABASE_ANON_KEY = ""
            TWILIO_ACCOUNT_SID = ""
            TWILIO_PHONE_NUMBER = ""
            ANTHROPIC_API_KEY = ""
            ELEVENLABS_API_KEY = "sk_db375de384ece60f214056dd93a2532e30d0831e7b5d0ada"
        settings = DummySettings()

# 3. Load routers with graceful isolation
import_errors = {}

def safe_include(module_path: str, attr_name: str = "router"):
    try:
        mod = __import__(module_path, fromlist=[attr_name])
        router = getattr(mod, attr_name)
        app.include_router(router)
    except Exception:
        import_errors[module_path] = traceback.format_exc()

safe_include("routers.homes")
safe_include("routers.residents")
safe_include("routers.bookings")
safe_include("routers.calls")
safe_include("routers.twiml")

# 4. Optional background scheduler for local dev only
IS_SERVERLESS = bool(
    os.getenv("VERCEL")
    or os.getenv("VERCEL_ENV")
    or os.getenv("AWS_LAMBDA_FUNCTION_NAME")
    or os.getenv("LAMBDA_TASK_ROOT")
    or os.getenv("AWS_EXECUTION_ENV")
)

if not IS_SERVERLESS:
    try:
        from services.scheduler import start_scheduler
        start_scheduler()
    except Exception:
        pass

@app.get("/")
@app.get("/api")
async def root():
    return {
        "app": getattr(settings, "APP_NAME", "Calmie API"),
        "tagline": "The world forgot to call. We didn't.",
        "status": "online",
        "docs": "/docs",
        "version": "1.0.0",
        "import_errors": import_errors or None
    }

@app.get("/health")
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy" if not import_errors else "degraded",
        "supabase": bool(getattr(settings, "SUPABASE_URL", None) and getattr(settings, "SUPABASE_ANON_KEY", None)),
        "twilio": bool(getattr(settings, "TWILIO_ACCOUNT_SID", None) and getattr(settings, "TWILIO_PHONE_NUMBER", None)),
        "anthropic": bool(getattr(settings, "ANTHROPIC_API_KEY", None)),
        "elevenlabs": bool(getattr(settings, "ELEVENLABS_API_KEY", None)),
        "import_errors": import_errors or None
    }
