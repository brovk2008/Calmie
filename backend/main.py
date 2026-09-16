import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routers.homes import router as homes_router
from .routers.residents import router as residents_router
from .routers.bookings import router as bookings_router
from .routers.calls import router as calls_router
from .routers.twiml import router as twiml_router
from .services.scheduler import start_scheduler, stop_scheduler

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("calmie")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.APP_NAME} in {settings.ENV} mode...")
    start_scheduler()
    yield
    stop_scheduler()
    logger.info(f"Shutting down {settings.APP_NAME}...")

app = FastAPI(
    title=settings.APP_NAME,
    description="Calmie Voice AI & Senior Check-in Platform Backend",
    version="1.0.0",
    lifespan=lifespan
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
async def root():
    return {
        "app": settings.APP_NAME,
        "tagline": "The world forgot to call. We didn't.",
        "status": "online",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "supabase": bool(settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY),
        "twilio": bool(settings.TWILIO_ACCOUNT_SID and settings.TWILIO_PHONE_NUMBER),
        "target_verified_phone": settings.TWILIO_VERIFIED_CALLER_ID
    }
