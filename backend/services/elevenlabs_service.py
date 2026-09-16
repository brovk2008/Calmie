import logging
import httpx
from typing import Dict, Any, Optional
from ..config import settings

logger = logging.getLogger("calmie.elevenlabs")

ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1"

# Popular ElevenLabs Creator Voices mapped to IDs
ELEVENLABS_VOICE_IDS = {
    # Female Voices
    "aria": "9BWtsMINqrJLrRacOk9x",
    "rachel": "21m00Tcm4TlvDq8ikWAM",
    "sarah": "EXAVITQu4vr4xnSDxMaL",
    "priya": "ThT5KcBeYPX3keUQqHPh",
    "lily": "pFZP5JQG7iQjIQuC4Bku",
    # Male Voices
    "brian": "nPczCjzI2devNBz1zQrb",
    "george": "JBFqnCBsd6RMkjVDRZzb",
    "adam": "pNInz6obpgDQGcFmaJgB",
    "daniel": "onwK4e9ZLuTAKqWW03F9",
    "kabir": "VR6AewLTigWG4xSOukaG",
}

class ElevenLabsService:
    def __init__(self):
        self.api_key = settings.ELEVENLABS_API_KEY

    def is_configured(self) -> bool:
        return bool(self.api_key and len(self.api_key.strip()) > 5)

    async def generate_speech(
        self,
        text: str,
        voice_id: str = "aria",
        stability: float = 0.45,
        similarity_boost: float = 0.80,
        style: float = 0.35,
    ) -> Optional[bytes]:
        """
        Generates ultra-calming neural TTS audio bytes from ElevenLabs API.
        """
        if not self.is_configured():
            logger.info("ElevenLabs API Key not configured; skipping neural TTS call.")
            return None

        # Resolve voice ID
        actual_voice_id = ELEVENLABS_VOICE_IDS.get(voice_id.lower(), voice_id)

        url = f"{ELEVENLABS_API_URL}/text-to-speech/{actual_voice_id}"
        headers = {
            "xi-api-key": self.api_key,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        }
        payload = {
            "text": text,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {
                "stability": stability,
                "similarity_boost": similarity_boost,
                "style": style,
                "use_speaker_boost": True,
            },
        }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(url, headers=headers, json=payload)
                if res.status_code == 200:
                    return res.content
                logger.warning(f"ElevenLabs TTS returned HTTP {res.status_code}: {res.text}")
        except Exception as e:
            logger.error(f"Error calling ElevenLabs API: {e}")
        return None

elevenlabs_service = ElevenLabsService()
