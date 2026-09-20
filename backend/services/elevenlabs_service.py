import logging
import os
import httpx
from typing import Dict, Any, List, Optional
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

    async def clone_voice(
        self,
        audio_bytes: bytes,
        name: str,
        content_type: str = "audio/webm",
    ) -> Optional[str]:
        """
        Create an ElevenLabs Instant Voice Clone (IVC) from uploaded audio bytes.
        Returns the new voice_id on success, None on failure.
        """
        if not self.is_configured():
            logger.warning("ElevenLabs API Key not configured; cannot clone voice.")
            return None

        import io
        url = f"{ELEVENLABS_API_URL}/voices/add"
        
        # ElevenLabs IVC requires multipart/form-data
        # Determine file extension from content type
        ext_map = {
            "audio/webm": "recording.webm",
            "audio/wav": "recording.wav",
            "audio/mpeg": "recording.mp3",
            "audio/mp3": "recording.mp3",
            "audio/ogg": "recording.ogg",
        }
        filename = ext_map.get(content_type, "recording.webm")

        try:
            import httpx as _httpx
            async with _httpx.AsyncClient(timeout=60.0) as client:
                files = [("files", (filename, io.BytesIO(audio_bytes), content_type))]
                data = {
                    "name": name,
                    "labels": '{"use": "calmie-clone"}',
                    "description": "Calmie family voice clone for personalized senior calls",
                }
                headers = {"xi-api-key": self.api_key}
                res = await client.post(url, headers=headers, files=files, data=data)
                if res.status_code == 200:
                    body = res.json()
                    voice_id = body.get("voice_id")
                    logger.info(f"Voice clone created: {voice_id} ({name})")
                    return voice_id
                logger.warning(f"ElevenLabs IVC returned HTTP {res.status_code}: {res.text[:300]}")
        except Exception as e:
            logger.error(f"Voice cloning error: {e}")
        return None

    async def list_cloned_voices(self) -> List[Dict[str, Any]]:
        """List all voices on the ElevenLabs account tagged as calmie-clone."""
        if not self.is_configured():
            return []
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.get(
                    f"{ELEVENLABS_API_URL}/voices",
                    headers={"xi-api-key": self.api_key},
                )
                if res.status_code == 200:
                    all_voices = res.json().get("voices", [])
                    # Filter to voices we created (label or name prefix)
                    calmie_clones = [
                        {
                            "voice_id": v["voice_id"],
                            "name": v["name"],
                            "category": v.get("category", "cloned"),
                            "preview_url": v.get("preview_url"),
                            "labels": v.get("labels", {}),
                        }
                        for v in all_voices
                        if "calmie" in v.get("name", "").lower()
                        or "calmie-clone" in str(v.get("labels", {}))
                    ]
                    return calmie_clones
        except Exception as e:
            logger.error(f"Error listing ElevenLabs voices: {e}")
        return []

    async def delete_voice(self, voice_id: str) -> bool:
        """Delete a voice clone from ElevenLabs."""
        if not self.is_configured():
            return False
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.delete(
                    f"{ELEVENLABS_API_URL}/voices/{voice_id}",
                    headers={"xi-api-key": self.api_key},
                )
                if res.status_code in (200, 204):
                    logger.info(f"Deleted voice clone: {voice_id}")
                    return True
                logger.warning(f"Delete voice returned {res.status_code}: {res.text[:200]}")
        except Exception as e:
            logger.error(f"Error deleting voice {voice_id}: {e}")
        return False


elevenlabs_service = ElevenLabsService()
