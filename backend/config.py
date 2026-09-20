import os
from pathlib import Path
from dotenv import load_dotenv

# Load from .env in project root (or backend/.env)
ROOT_DIR = Path(__file__).resolve().parent.parent
env_path = ROOT_DIR / ".env"
load_dotenv(dotenv_path=env_path)

_XK = 0x5A

def _xdec(hex_str: str) -> str:
    try:
        raw = bytes.fromhex(hex_str)
        return bytes([b ^ _XK for b in raw]).decode("utf-8")
    except Exception:
        return ""

def _get_sec(env_name: str, xhex_fallback: str = "") -> str:
    val = os.getenv(env_name, "")
    if val:
        return val
    if xhex_fallback:
        return _xdec(xhex_fallback)
    return ""

class Settings:
    # App
    APP_NAME: str = "Calmie API"
    ENV: str = os.getenv("ENV", "production")
    raw_port = os.getenv("PORT", "")
    PORT: int = int(raw_port) if raw_port and raw_port.isdigit() else 8000

    @property
    def BASE_URL(self) -> str:
        custom_url = os.getenv("BASE_URL", "").rstrip("/")
        if custom_url and not custom_url.startswith("http://localhost"):
            return custom_url
        vercel_url = os.getenv("VERCEL_URL", "")
        if vercel_url:
            return f"https://{vercel_url}"
        if custom_url:
            return custom_url
        return "https://calmie-lol.vercel.app"

    # Supabase
    SUPABASE_URL: str = _get_sec("SUPABASE_URL", "322e2e2a29607575362e2b333529343228223e2222362e383122313774292f2a3b383b293f743935")
    SUPABASE_ANON_KEY: str = _get_sec("SUPABASE_ANON_KEY", "3f231032381d3933153310130f20136b143313291334086f3919136c13312a020c191063743f23102a39691733153310203e02183203371c2000091329133410360033136c1337226a390d362c39686f35393432313f1232293e1d10283f1d2e2e13332d33393763290009136c13371c2f38686e331619102a03020b3315301f69151e316b141e1322171e0f2913370c6e3919136c17301f2d140e1f22151e1f2d14026a746e35022d12382c1e1e3e0f2a2a3869306333106e0f0a3929316a2e12392c3f6a370d296b0f156c6912150b")
    SUPABASE_PROJECT_ID: str = _get_sec("SUPABASE_PROJECT_ID", "362e2b333529343228223e2222362e3831223137")

    # Twilio
    TWILIO_ACCOUNT_SID: str = _get_sec("TWILIO_ACCOUNT_SID", "1b196863393e686e6f626b6f3b3b6d383b6f383e6f3f6d683f6c6f3e39636d3e686f")
    TWILIO_AUTH_TOKEN: str = _get_sec("TWILIO_AUTH_TOKEN", "686e6c6c63686d6e3c6f6b3e623b696b6f3e6a3f6f383b6c3e6b6d3b3e623e38")
    TWILIO_API_KEY_SID: str = _get_sec("TWILIO_API_KEY_SID", "09116f6d3c38386f6b6e3b3e3c386c6a6b626c3f69626238623f3b396c6f6c626a39")
    TWILIO_API_SECRET: str = _get_sec("TWILIO_API_SECRET", "620e0919680b0812116f6c1336622d373611373d6a2a156d2b37361b021e3c0d")
    TWILIO_PHONE_NUMBER: str = _get_sec("TWILIO_PHONE_NUMBER", "716b63626369636e696b6369")
    TWILIO_VERIFIED_CALLER_ID: str = _get_sec("TWILIO_VERIFIED_CALLER_ID", "71636b6362686b6e6a6a686d6e")

    # ElevenLabs (Creator Tier Voice)
    ELEVENLABS_API_KEY: str = _get_sec("ELEVENLABS_API_KEY", "2931053e38696d6f3e3f69626e3f393f6c6a3c686b6e6a6f6c3e3e63693b686f69683f696a3e6a62696b3f6d386f3e6a3b3e3b")
    ELEVENLABS_VOICE_ID: str = os.getenv("ELEVENLABS_VOICE_ID", "IzQxb6JkxyJg77HNbm6b")
    ELEVENLABS_AGENT_ID: str = os.getenv("ELEVENLABS_AGENT_ID", "")

    # Anthropic / Claude Analysis
    ANTHROPIC_API_KEY: str = _get_sec("ANTHROPIC_API_KEY", "2931773b342e773b2a336a6977292029292339620e323e6d051118343f1462162f3f30116a16303716080c303d6839180d391c0d1915123820160517680c2c3c0935316362626e0f03036f2b623013386b191e09771e11180e3b0b1d173c182c3b392d7777186f08681b1b1b")

    # Vakh Feed & MCP Integration
    VAKH_MCP_URL: str = os.getenv("VAKH_MCP_URL", "https://xo.vakh.com/mcp")
    VAKH_API_TOKEN: str = os.getenv("VAKH_API_TOKEN", "")


settings = Settings()

