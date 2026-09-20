"""
Voice Cloning API — ElevenLabs Instant Voice Cloning (IVC).
Routes:
  POST   /api/voice/clone             — upload audio, create voice clone
  GET    /api/voice/clones            — list all Calmie voice clones
  DELETE /api/voice/clone/{voice_id}  — delete a voice clone
"""
import logging
import uuid
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from pydantic import BaseModel

try:
    from ..services.elevenlabs_service import elevenlabs_service
except (ImportError, ValueError):
    from services.elevenlabs_service import elevenlabs_service

logger = logging.getLogger("calmie.voice_cloning")
router = APIRouter(prefix="/api/voice", tags=["voice"])


class CloneResponse(BaseModel):
    success: bool
    voice_id: Optional[str] = None
    name: Optional[str] = None
    message: str


@router.post("/clone", response_model=CloneResponse)
async def create_voice_clone(
    audio: UploadFile = File(...),
    name: str = Form(default="My Voice"),
    consent: bool = Form(default=False),
):
    """
    Upload a voice recording (WAV/MP3/WebM) to create an ElevenLabs Instant Voice Clone.
    Returns the cloned voice_id for use in calls.
    """
    if not consent:
        raise HTTPException(
            status_code=400,
            detail="Voice cloning consent is required. Please confirm that this is your own voice.",
        )

    if not audio.filename:
        raise HTTPException(status_code=400, detail="No audio file provided")

    audio_bytes = await audio.read()
    if len(audio_bytes) < 5000:
        raise HTTPException(
            status_code=400,
            detail="Audio too short. Please record at least 30 seconds for good voice cloning quality.",
        )
    if len(audio_bytes) > 50 * 1024 * 1024:  # 50MB max
        raise HTTPException(status_code=413, detail="Audio file too large (max 50MB)")

    # Sanitize clone name
    safe_name = f"calmie-{name.strip()[:40]}-{uuid.uuid4().hex[:6]}"
    content_type = audio.content_type or "audio/webm"

    logger.info(f"Creating voice clone: '{safe_name}' ({len(audio_bytes)} bytes, {content_type})")

    voice_id = await elevenlabs_service.clone_voice(
        audio_bytes=audio_bytes,
        name=safe_name,
        content_type=content_type,
    )

    if not voice_id:
        raise HTTPException(
            status_code=500,
            detail="Voice cloning failed. Please try again with a clearer recording.",
        )

    return CloneResponse(
        success=True,
        voice_id=voice_id,
        name=safe_name,
        message="Voice cloned successfully! Your voice will be used for the next call.",
    )


@router.get("/clones")
async def list_clones():
    """List all Calmie voice clones from ElevenLabs."""
    clones = await elevenlabs_service.list_cloned_voices()
    return {"success": True, "count": len(clones), "clones": clones}


@router.delete("/clone/{voice_id}")
async def delete_clone(voice_id: str):
    """Delete a voice clone from ElevenLabs."""
    if not voice_id or len(voice_id) < 5:
        raise HTTPException(status_code=400, detail="Invalid voice_id")

    ok = await elevenlabs_service.delete_voice(voice_id)
    if not ok:
        raise HTTPException(status_code=500, detail="Failed to delete voice clone")

    return {"success": True, "message": f"Voice clone {voice_id} deleted."}
