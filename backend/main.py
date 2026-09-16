import os
import sys
import logging
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Add backend directory and parent directory to sys.path for standalone serverless runtimes
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))
if str(backend_dir.parent) not in sys.path:
    sys.path.insert(0, str(backend_dir.parent))

try:
    from .config import settings
    from .routers.homes import router as homes_router
    from .routers.residents import router as residents_router
    from .routers.bookings import router as bookings_router
    from .routers.calls import router as calls_router
    from .routers.twiml import router as twiml_router
    from .services.scheduler import start_scheduler, stop_scheduler
except (ImportError, ValueError):
    from config import settings
    from routers.homes import router as homes_router
    from routers.residents import router as residents_router
    from routers.bookings import router as bookings_router
    from routers.calls import router as calls_router
    from routers.twiml import router as twiml_router
    from services.scheduler import start_scheduler, stop_scheduler

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("calmie")

IS_SERVERLESS = bool(
    os.getenv("VERCEL")
    or os.getenv("VERCEL_ENV")
    or os.getenv("AWS_LAMBDA_FUNCTION_NAME")
    or os.getenv("LAMBDA_TASK_ROOT")
    or os.getenv("AWS_EXECUTION_ENV")
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.APP_NAME} in {settings.ENV} mode...")
    if not IS_SERVERLESS:
        try:
            start_scheduler()
        except Exception as e:
            logger.warning(f"Scheduler skipped: {e}")
    yield
    if not IS_SERVERLESS:
        try:
            stop_scheduler()
        except Exception:
            pass
    logger.info(f"Shutting down {settings.APP_NAME}...")

app = FastAPI(
    title=settings.APP_NAME,
    description="Calmie Voice AI & Senior Check-in Platform Backend",
    version="1.0.0",
    lifespan=lifespan if not IS_SERVERLESS else None
)

# Enable CORS for frontend development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(homes_router)
app.include_router(residents_router)
app.include_router(bookings_router)
app.include_router(calls_router)
app.include_router(twiml_router)

@app.get("/")
@app.get("/api")
async def root():
    return {
        "app": settings.APP_NAME,
        "tagline": "The world forgot to call. We didn't.",
        "status": "online",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "supabase": bool(settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY),
        "twilio": bool(settings.TWILIO_ACCOUNT_SID and settings.TWILIO_PHONE_NUMBER),
        "anthropic": bool(settings.ANTHROPIC_API_KEY),
        "elevenlabs": bool(settings.ELEVENLABS_API_KEY)
    }
