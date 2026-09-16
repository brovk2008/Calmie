import os
from pathlib import Path
from dotenv import load_dotenv

# Load from .env in project root (or backend/.env)
ROOT_DIR = Path(__file__).resolve().parent.parent
env_path = ROOT_DIR / ".env"
load_dotenv(dotenv_path=env_path)

class Settings:
    # App
    APP_NAME: str = "Calmie API"
    ENV: str = os.getenv("ENV", "development")
    raw_port = os.getenv("PORT", "")
    PORT: int = int(raw_port) if raw_port and raw_port.isdigit() else 8000

    # Auto-detect production BASE_URL from Vercel's injected VERCEL_URL env var
    # VERCEL_URL is automatically set on all deployments (no https:// prefix)
    @property
    def BASE_URL(self) -> str:
        custom_url = os.getenv("BASE_URL", "").strip().rstrip("/")
        if custom_url and not custom_url.startswith("http://localhost"):
            return custom_url
        vercel_url = os.getenv("VERCEL_URL", "").strip()
        if vercel_url:
            return f"https://{vercel_url}"
        if custom_url:
            return custom_url
        return "http://localhost:8000"

    # Supabase
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://ltqiosnhrxdxxltbkxkm.supabase.co")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
    SUPABASE_PROJECT_ID: str = os.getenv("SUPABASE_PROJECT_ID", "ltqiosnhrxdxxltbkxkm")

    # Twilio
    TWILIO_ACCOUNT_SID: str = os.getenv("TWILIO_ACCOUNT_SID", "")
    TWILIO_AUTH_TOKEN: str = os.getenv("TWILIO_AUTH_TOKEN", "")
    TWILIO_API_KEY_SID: str = os.getenv("TWILIO_API_KEY_SID", "")
    TWILIO_API_SECRET: str = os.getenv("TWILIO_API_SECRET", "")
    TWILIO_PHONE_NUMBER: str = os.getenv("TWILIO_PHONE_NUMBER", "")
    TWILIO_VERIFIED_CALLER_ID: str = os.getenv("TWILIO_VERIFIED_CALLER_ID", "")

    # ElevenLabs (Creator Tier Voice)
    ELEVENLABS_API_KEY: str = os.getenv("ELEVENLABS_API_KEY", "")
    ELEVENLABS_VOICE_ID: str = os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")
    ELEVENLABS_AGENT_ID: str = os.getenv("ELEVENLABS_AGENT_ID", "")

    # Anthropic / Claude Analysis
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")

    # Vakh Feed & MCP Integration
    VAKH_MCP_URL: str = os.getenv("VAKH_MCP_URL", "https://xo.vakh.com/mcp")
    VAKH_API_TOKEN: str = os.getenv("VAKH_API_TOKEN", "")


settings = Settings()
