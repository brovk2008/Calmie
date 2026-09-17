import logging
import httpx
from typing import Dict, Any, Optional
try:
    from ..config import settings
except (ImportError, ValueError):
    from config import settings

logger = logging.getLogger("calmie.elevenlabs")

ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1"

# Hyper-Realistic Native Indian & Multilingual Conversational Voice IDs
ELEVENLABS_VOICE_IDS = {
    # Female Voices
    "aria": "IzQxb6JkxyJg77HNbm6b",      # Anjura - Warm, Expressive & Clear Granddaughter
    "anjura": "IzQxb6JkxyJg77HNbm6b",
    "rachel": "M6udCbeLpbqc4ZtMMDGJ",    # Ria - Soft & Soothing Indian Narrator
    "ria": "M6udCbeLpbqc4ZtMMDGJ",
    "sarah": "gM97WcXnv5iYPHhVZJN8",     # Rashi - Gentle & Reassuring Companion
    "rashi": "gM97WcXnv5iYPHhVZJN8",
    "priya": "ThT5KcBeYPX3keUQqHPh",     # Priya - Traditional Respectful
    "lily": "yNLymtQiql9Dxxobo0Cl",      # Saanu - Velvety, Peaceful & Calm Care
    "saanu": "yNLymtQiql9Dxxobo0Cl",
    # Male Voices
    "brian": "qIo8SDYwOdVhx4cn8o6U",     # Rith - Respectful & Grounded Grandson
    "rith": "qIo8SDYwOdVhx4cn8o6U",
    "george": "JSZ6mrlwqYAjKBo9OVaS",    # AB - Warm, Dignified Storyteller
    "ab": "JSZ6mrlwqYAjKBo9OVaS",
    "adam": "P7S04a3RSZ9FmMIw9JVS",      # Ashish - Warm, Polite Grandson
    "ashish": "P7S04a3RSZ9FmMIw9JVS",
    "daniel": "niLTODfB1j2nXIbp3M14",    # Pranab - Deep & Reassuring Fatherly Presence
    "pranab": "niLTODfB1j2nXIbp3M14",
    "kabir": "dC5hdN77LtL8UVTQj3gZ",     # Arjun - Attentive, Courteous Listener
    "arjun": "dC5hdN77LtL8UVTQj3gZ",
}

class ElevenLabsService:
    def __init__(self):
        self.api_key = getattr(settings, "ELEVENLABS_API_KEY", "") or os.getenv("ELEVENLABS_API_KEY", "")

    def is_configured(self) -> bool:
        return bool(self.api_key and len(self.api_key.strip()) > 5)

    async def generate_speech(
        self,
        text: str,
        voice_id: str = "aria",
        stability: float = 0.36,
        similarity_boost: float = 0.84,
        style: float = 0.30,
    ) -> Optional[bytes]:
        """
        Generates ultra-human, conversational neural TTS audio bytes from ElevenLabs API.
        Uses lower stability (0.36) for expressive emotional range and vocal inflections.
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
