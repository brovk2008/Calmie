from fastapi import APIRouter, Request, Response
try:
    from ..supabase_client import supabase_db
    from ..prompt_builder import build_first_sentence
    from ..config import settings
    from ..services.elevenlabs_service import elevenlabs_service
except (ImportError, ValueError):
    from supabase_client import supabase_db
    from prompt_builder import build_first_sentence
    from config import settings
    from services.elevenlabs_service import elevenlabs_service
import logging
import httpx

import logging
import httpx
import urllib.parse
from typing import Optional

logger = logging.getLogger("calmie.twiml")
router = APIRouter(prefix="/api/twiml", tags=["TwiML"])

# In-memory audio cache for zero-latency telephony playback
_tts_cache = {}

def render_twiml_speech(text: str, voice_gender: str = "female", voice_id: Optional[str] = None) -> str:
    """
    Renders high-fidelity audio TwiML.
    Uses ElevenLabs <Play> audio stream whenever configured, with Neural Polly fallback.
    """
    if not voice_id:
        voice_id = "rith" if voice_gender == "male" else "anjura"
    
    if elevenlabs_service.is_configured():
        encoded_text = urllib.parse.quote(text)
        tts_url = f"{settings.BASE_URL}/api/twiml/tts?text={encoded_text}&amp;voice_id={voice_id}"
        return f"<Play>{tts_url}</Play>"
    else:
        polly_voice = "Polly.Matthew" if voice_gender == "male" else "Polly.Kajal-Neural"
        polly_lang = "en-IN" if voice_gender == "male" else "hi-IN"
        return f'<Say voice="{polly_voice}" language="{polly_lang}">{text}</Say>'

@router.api_route("/welcome", methods=["GET", "POST"])
@router.api_route("/outbound", methods=["GET", "POST"])
async def twiml_outbound(
    resident_id: str = "",
    booking_id: str = "",
    voice_gender: str = "female",
    voice_id: Optional[str] = None
):
    resident = await supabase_db.get_resident_by_id(resident_id) or {}
    first_greeting = build_first_sentence(resident, voice_gender=voice_gender)
    v_id = voice_id or ("rith" if voice_gender == "male" else "anjura")
    
    speech_1 = render_twiml_speech(first_greeting, voice_gender=voice_gender, voice_id=v_id)
    speech_prompt = render_twiml_speech(
        "Bataiye na... aaj ka din kaisa raha? Shanti Niwas mein sab theek chal raha hai?",
        voice_gender=voice_gender,
        voice_id=v_id
    )
    speech_farewell = render_twiml_speech(
        "Aapki aawaz sun kar dil khush ho gaya... apna dhyan rakhiyega... Radhe Radhe!",
        voice_gender=voice_gender,
        voice_id=v_id
    )

    xml_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    {speech_1}
    <Pause length="1"/>
    <Gather input="speech" timeout="6" speechTimeout="auto" action="{settings.BASE_URL}/api/twiml/gather?resident_id={resident_id}&amp;turn=1&amp;gender={voice_gender}&amp;voice_id={v_id}" method="POST">
        {speech_prompt}
    </Gather>
    {speech_farewell}
</Response>"""
    return Response(content=xml_content, media_type="application/xml")

@router.api_route("/gather", methods=["GET", "POST"])
async def twiml_gather(
    request: Request,
    resident_id: str = "",
    turn: int = 1,
    gender: str = "female",
    voice_id: Optional[str] = None
):
    form_data = await request.form()
    speech_result = form_data.get("SpeechResult", "").strip()
    logger.info(f"[Turn {turn}] Senior said: {speech_result}")

    resident = await supabase_db.get_resident_by_id(resident_id) or {}
    name = resident.get("name", "Elder").split()[0]
    v_id = voice_id or ("rith" if gender == "male" else "anjura")

    # Check if senior mentioned pain or emergency
    lower_speech = speech_result.lower()
    is_emergency = any(w in lower_speech for w in ["dard", "pain", "gira", "fall", "dawai", "medicine", "doctor"])

    if is_emergency:
        reply = f"Aap bilkul chinta mat kijiye {name} ji... Main turant Shanti Niwas ke doctor aur nursing team ko inform kar rahi hoon... Aap aaram se baithe rahiye."
        emergency_speech = render_twiml_speech(reply, voice_gender=gender, voice_id=v_id)
        xml_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    {emergency_speech}
    <Pause length="1"/>
    <Hangup/>
</Response>"""
        return Response(content=xml_content, media_type="application/xml")

    # If nearing 5 minutes (turn >= 3 or 4), initiate natural human wind-down
    if turn >= 3:
        closing_self = "main phir phone karunga" if gender == "male" else "main phir phone karungi"
        wrapup_speech_text = (
            f"Arey {name} ji!... Aapse baat karte waqt ka pata hi nahi chala! "
            f"Mujhe agle kaam ke liye nikalna hoga, par sach bataoon aapse baat karke dil halka ho gaya... "
            f"Aap aaram se shaam ki chai piyiyega, aur {closing_self}... Apna khoob khayal rakhiyega! Namaste!"
        )
        wrapup_audio = render_twiml_speech(wrapup_speech_text, voice_gender=gender, voice_id=v_id)
        xml_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    {wrapup_audio}
    <Pause length="1"/>
    <Hangup/>
</Response>"""
        return Response(content=xml_content, media_type="application/xml")

    # Conversational turn: generate dynamic response
    reply = ""
    if settings.ANTHROPIC_API_KEY:
        try:
            models_to_try = [
                "claude-haiku-4-5-20251001",
                "claude-3-5-haiku-20241022",
                "claude-3-haiku-20240307"
            ]
            async with httpx.AsyncClient(timeout=8.0) as client:
                for model_name in models_to_try:
                    res = await client.post(
                        "https://api.anthropic.com/v1/messages",
                        headers={
                            "x-api-key": settings.ANTHROPIC_API_KEY,
                            "anthropic-version": "2023-06-01",
                            "content-type": "application/json"
                        },
                        json={
                            "model": model_name,
                            "max_tokens": 120,
                            "system": (
                                f"You are Calmie, a loving {'grandson' if gender == 'male' else 'granddaughter'} calling {name} in an old age home. "
                                f"They like: {resident.get('favorite_topics')}. Avoid: {resident.get('avoid_topics')}. "
                                "Reply warmly in simple Hindi/English mix in 1-2 short affectionate sentences. Use natural conversational punctuation with pauses (...) and validate their feelings."
                            ),
                            "messages": [{"role": "user", "content": speech_result or "Acha lag raha hai"}]
                        }
                    )
                    if res.status_code == 200:
                        reply = res.json()["content"][0]["text"].strip()
                        break
            if not reply:
                reply = f"Wah {name} ji!... Yeh sunkar bahut sukoon mila... Aur bataiye, aage kya plan hai aaj ka?"
        except Exception:
            reply = f"Wah {name} ji!... Yeh sunkar bahut sukoon mila... Aur bataiye, aage kya plan hai aaj ka?"
    else:
        if "cricket" in lower_speech or "match" in lower_speech or "world cup" in lower_speech:
            reply = "Wah!... 1983 World Cup jaisa jazba to aaj kal ke matches mein kahan dekhne ko milta hai! Kapil Dev ka catch yaad aate hi dil jhoom uthta hai na?"
        elif "garden" in lower_speech or "phool" in lower_speech or "balcony" in lower_speech:
            reply = "Aapke balcony ke jasmine phool to waqai sabse sundar hain!... Subah subah unki khushboo se poora din accha guzar jaata hai."
        elif "army" in lower_speech or "fauj" in lower_speech or "war" in lower_speech:
            reply = "Colonel Sahab, aapke jaise jabaaz afsaron ki wajah se hi desh surakshit hai... Aapki baatein sun kar bada garv hota hai."
        else:
            reply = f"Wah {name} ji!... Aapki baat sun kar dil khush ho gaya... Mujhe aapse baat karke bilkul apne parivaar jaisa lagta hai."

    next_turn = turn + 1
    reply_audio = render_twiml_speech(reply, voice_gender=gender, voice_id=v_id)
    gather_prompt_audio = render_twiml_speech("Bataiye na... main sun rahi hoon...", voice_gender=gender, voice_id=v_id)
    closing_audio = render_twiml_speech(f"Chaliye {name} ji... abhi main chalti hoon... Apna khayal rakhiyega, Radhe Radhe!", voice_gender=gender, voice_id=v_id)

    xml_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    {reply_audio}
    <Pause length="1"/>
    <Gather input="speech" timeout="6" speechTimeout="auto" action="{settings.BASE_URL}/api/twiml/gather?resident_id={resident_id}&amp;turn={next_turn}&amp;gender={gender}&amp;voice_id={v_id}" method="POST">
        {gather_prompt_audio}
    </Gather>
    {closing_audio}
</Response>"""
    return Response(content=xml_content, media_type="application/xml")

@router.api_route("/status", methods=["GET", "POST"])
async def twiml_status(request: Request, call_id: str = ""):
    form_data = await request.form()
    call_status = form_data.get("CallStatus", "")
    call_sid = form_data.get("CallSid", "")
    logger.info(f"Twilio Call Status: {call_status} (SID: {call_sid}, ID: {call_id})")
    return {"received": True, "status": call_status}

@router.get("/tts")
async def stream_tts(text: str, voice_id: str = "anjura"):
    cache_key = f"{voice_id}:{text}"
    if cache_key in _tts_cache:
        return Response(content=_tts_cache[cache_key], media_type="audio/mpeg")

    audio = await elevenlabs_service.generate_speech(text=text, voice_id=voice_id)
    if audio:
        if len(_tts_cache) < 80:
            _tts_cache[cache_key] = audio
        return Response(content=audio, media_type="audio/mpeg")
    return Response(content=b"", status_code=404)

