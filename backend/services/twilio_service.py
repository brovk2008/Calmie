import logging
from typing import Dict, Any, Optional
from twilio.rest import Client
try:
    from ..config import settings
    from ..prompt_builder import build_first_sentence, build_system_prompt
    from ..routers.twiml import render_twiml_speech
except (ImportError, ValueError):
    from config import settings
    from prompt_builder import build_first_sentence, build_system_prompt
    from routers.twiml import render_twiml_speech

logger = logging.getLogger("calmie.twilio")

class TwilioService:
    def __init__(self):
        self.account_sid = settings.TWILIO_ACCOUNT_SID
        self.auth_token = settings.TWILIO_AUTH_TOKEN
        self.api_key = settings.TWILIO_API_KEY_SID
        self.api_secret = settings.TWILIO_API_SECRET
        self.from_phone = settings.TWILIO_PHONE_NUMBER
        self.verified_phone = settings.TWILIO_VERIFIED_CALLER_ID
        
        self.client: Optional[Client] = None
        try:
            if self.api_key and self.api_secret and self.account_sid:
                self.client = Client(self.api_key, self.api_secret, self.account_sid)
                logger.info("Twilio client initialized via API Key successfully.")
            elif self.account_sid and self.auth_token:
                self.client = Client(self.account_sid, self.auth_token)
                logger.info("Twilio client initialized via Account SID & Auth Token successfully.")
            else:
                logger.warning("Twilio credentials not found in settings.")
        except Exception as e:
            logger.error(f"Failed to initialize Twilio client: {e}")

    def format_phone(self, phone: str) -> str:
        clean = phone.strip().replace(" ", "").replace("-", "")
        if clean.startswith("+"):
            return clean
        if len(clean) == 10:
            return f"+91{clean}"
        return f"+{clean}"

    async def initiate_outbound_call(
        self,
        to_phone: str,
        resident: Dict[str, Any],
        booking: Optional[Dict[str, Any]] = None,
        call_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Initiates an outbound phone call using Twilio.
        Because Twilio trial accounts require verified numbers, we ensure it routes to
        the verified recipient (+919821400274).
        """
        formatted_to = self.format_phone(to_phone)
        # Enforce verified recipient in trial mode if needed
        target_phone = self.verified_phone if self.verified_phone else formatted_to

        booker_name = booking.get("booker_name") if booking else None
        voice_gender = (booking.get("voice_gender") if booking else "female") or "female"
        selected_voice = (booking.get("selected_voice") if booking else "aria") or "aria"

        # Voice selection based on gender and persona
        if voice_gender.lower() == "male" or any(m in selected_voice.lower() for m in ["brian", "george", "rith", "ab", "ashish", "pranab", "arjun"]):
            closing_phrase = "Aapki aawaz sun kar bahut achha laga. Main phir phone karunga. Apna khayal rakhiyega!"
        else:
            closing_phrase = "Aapki aawaz sun kar bahut achha laga. Main phir phone karungi. Apna khayal rakhiyega!"

        v_id = selected_voice.lower() if selected_voice else ("rith" if voice_gender == "male" else "anjura")
        first_greeting = build_first_sentence(resident, booker_name, voice_gender=voice_gender)
        
        # Build interactive TwiML response with super-human ElevenLabs streaming
        speech_first = render_twiml_speech(first_greeting, voice_gender=voice_gender, voice_id=v_id)
        speech_question = render_twiml_speech(
            "Bataiye, aaj ka din kaisa raha? Shanti Niwas mein sab theek chal raha hai?",
            voice_gender=voice_gender,
            voice_id=v_id
        )
        speech_closing = render_twiml_speech(
            closing_phrase,
            voice_gender=voice_gender,
            voice_id=v_id
        )

        twiml_script = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    {speech_first}
    <Pause length="1"/>
    <Gather input="speech" timeout="6" speechTimeout="auto" action="{settings.BASE_URL}/api/twiml/gather?resident_id={resident.get('id')}&amp;call_id={call_id or ''}&amp;gender={voice_gender}&amp;voice_id={v_id}" method="POST">
        {speech_question}
    </Gather>
    {speech_closing}
</Response>"""

        if not self.client:
            logger.error("Twilio client not initialized, cannot trigger live phone call")
            return {
                "success": False,
                "mock": False,
                "error": "Twilio client not initialized. Check Twilio credentials.",
                "call_sid": None,
                "to": target_phone,
                "from": self.from_phone,
                "status": "failed",
                "message": "Twilio client not configured"
            }

        try:
            logger.info(f"Triggering live Twilio call to {target_phone} from {self.from_phone} (Max 5 mins)...")
            call = self.client.calls.create(
                to=target_phone,
                from_=self.from_phone,
                twiml=twiml_script,
                time_limit=300,
                status_callback=f"{settings.BASE_URL}/api/twiml/status?call_id={call_id or ''}",
                status_callback_event=["initiated", "ringing", "answered", "completed"]
            )
            logger.info(f"Twilio call created successfully: SID {call.sid}")
            return {
                "success": True,
                "mock": False,
                "call_sid": call.sid,
                "to": target_phone,
                "from": self.from_phone,
                "status": call.status,
                "message": f"Live call dialed to {target_phone}"
            }
        except Exception as e:
            logger.error(f"Twilio call failed: {e}")
            return {
                "success": False,
                "error": str(e),
                "to": target_phone,
                "from": self.from_phone,
                "mock": False,
                "status": "failed",
                "call_sid": None,
                "message": f"Twilio dial error: {e}"
            }

twilio_service = TwilioService()
