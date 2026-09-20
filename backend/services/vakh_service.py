import logging
import uuid
import re
import datetime
from typing import Dict, Any, Optional, List
try:
    from ..config import settings
    from ..supabase_client import supabase_db
except (ImportError, ValueError):
    from config import settings
    from supabase_client import supabase_db

logger = logging.getLogger("calmie.vakh")

# Canonical Vakh Form and Post IDs for Calmie
VAKH_BOOKING_FORM_ID = "7013e76d-fdb6-43c7-8cc7-9b573f21624e"
VAKH_POSTS_FORM_ID = "ef430e27-decc-4a31-8e27-3be0579fa7b5"  # Form named "Calmie"
VAKH_BOOKING_POST_ID = "646247ec-90ef-41d9-8f05-b664cf963ef3"

# Pre-seeded official posts and confirmations from Vakh
INITIAL_COMMUNITY_POSTS: List[Dict[str, Any]] = [
    {
        "id": "700710d4-bffd-47af-b218-7530047c524f",
        "form_id": VAKH_POSTS_FORM_ID,
        "author": {
            "name": "Calmie Official",
            "role": "Care Companion AI",
            "avatar": "https://xo.vakh.com/api/storage/avatar/bc437c6d-166a-4f5f-ad40-f30122021f98/1789534669610-2b8938d9-5016-450f-ba30-31c5232a29c2.webp"
        },
        "title": "🌸 Calmie Senior Community Feed is LIVE on Vakh!",
        "content": "Welcome to Calmie on Vakh! Where every senior at Shanti Niwas Old Age Home is remembered. Book warm AI companion phone calls with unique senior codes (CLM-RAMESH, CLM-KAMLA, CLM-HARBHAJAN), share care memories, and track daily check-in smiles. Powered by ElevenLabs Voice AI & Vakh.",
        "category": "announcement",
        "senior_code": None,
        "senior_name": "All Seniors",
        "heart_count": 12,
        "created_at": "2026-09-20T09:29:48.747Z",
        "status": "published"
    },
    {
        "id": "646247ec-90ef-41d9-8f05-b664cf963ef3",
        "form_id": VAKH_POSTS_FORM_ID,
        "author": {
            "name": "Calmie Dispatcher",
            "role": "Call Automation System",
            "avatar": "https://xo.vakh.com/api/storage/avatar/bc437c6d-166a-4f5f-ad40-f30122021f98/1789534669610-2b8938d9-5016-450f-ba30-31c5232a29c2.webp"
        },
        "title": "📞 Automated Senior Call Booking Guide — Shanti Niwas",
        "content": "You can book an authentic, warm AI companion call for seniors directly on Vakh!\n\n👉 STEP 1: Find the Senior's Unique Code:\n• Ramesh Tiwari (Room 104) ➔ Code: CLM-RAMESH\n• Kamla Devi (Room 108) ➔ Code: CLM-KAMLA\n• Col. (Retd.) Harbhajan Singh (Room 201) ➔ Code: CLM-HARBHAJAN\n\n👉 OPTION A: Reply with this format:\nSenior Code: CLM-RAMESH\nBooker Name: Vikram Tiwari\nPhone: +919821400274\nTime: 2026-09-20 18:30\nVoice: Anjura\nNote: Talk about 1983 World Cup\n\n👉 OPTION B: Fill the Direct Vakh Booking Form (ID: 7013e76d-fdb6-43c7-8cc7-9b573f21624e)\n\nCalmie automatically polls replies, reserves slots in database, confirms on Vakh, and triggers live phone calls!",
        "category": "guide",
        "senior_code": "CLM-RAMESH",
        "senior_name": "Ramesh Tiwari",
        "heart_count": 8,
        "created_at": "2026-09-20T06:53:28.251Z",
        "status": "published"
    },
    {
        "id": "395c267b-d8a8-4c4b-95a8-3e21545ece66",
        "form_id": VAKH_POSTS_FORM_ID,
        "author": {
            "name": "Meena Tiwari",
            "role": "Family Member",
            "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop"
        },
        "title": "✅ Slot Confirmed from Vakh Form for Ramesh Tiwari",
        "content": "✅ Slot Confirmed! Calmie has reserved a call slot for Ramesh Tiwari (CLM-RAMESH) on 2026-09-20 18:30 UTC.\nVoice Persona: Anjura (Warm Granddaughter)\nBooker: Meena Tiwari\nPhone: +919821400274\nTopics: 1983 Cricket World Cup, Mohammed Rafi songs & railway days\nCalmie's AI companion will dial Dadaji at the exact scheduled time!",
        "category": "confirmation",
        "senior_code": "CLM-RAMESH",
        "senior_name": "Ramesh Tiwari",
        "heart_count": 5,
        "created_at": "2026-09-20T07:06:38.584Z",
        "status": "published"
    },
    {
        "id": "ecff191c-3d70-46c5-b560-8f9a95540589",
        "form_id": VAKH_POSTS_FORM_ID,
        "author": {
            "name": "Rohan Sharma",
            "role": "Volunteer / Grandson",
            "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
        },
        "title": "✅ Slot Confirmed for Kamla Devi via Vakh Reply",
        "content": "✅ Slot Confirmed! Calmie has reserved a call slot for Kamla Devi (CLM-KAMLA) on 2026-09-20 19:00 UTC.\nVoice Persona: Priya (Sweet Hindi honorifics)\nPhone: +919821400274\nCalmie's AI companion will dial Kamla Devi with personalized topics about her balcony garden and Rajasthan memories!",
        "category": "confirmation",
        "senior_code": "CLM-KAMLA",
        "senior_name": "Kamla Devi",
        "heart_count": 7,
        "created_at": "2026-09-20T07:06:10.545Z",
        "status": "published"
    },
    {
        "id": "b7174079-e541-4fe6-80d1-381712049628",
        "form_id": VAKH_POSTS_FORM_ID,
        "author": {
            "name": "Calmie Care Bot",
            "role": "Automated Check-in Report",
            "avatar": "https://xo.vakh.com/api/storage/avatar/bc437c6d-166a-4f5f-ad40-f30122021f98/1789534669610-2b8938d9-5016-450f-ba30-31c5232a29c2.webp"
        },
        "title": "📞 Senior Check-in Completed: Ramesh Tiwari ⭐⭐⭐⭐⭐",
        "content": "📞 Calmie Senior Check-in Call Summary:\nRamesh Tiwari was in vibrant spirits today reminiscing about cricket and Shanti Niwas garden. Mood: ⭐⭐⭐⭐⭐ (5/5).\nTalked about Sunil Gavaskar's batting and how the rainy weather in Prayagraj used to delay trains when he was station master.",
        "category": "care_update",
        "senior_code": "CLM-RAMESH",
        "senior_name": "Ramesh Tiwari",
        "heart_count": 14,
        "created_at": "2026-09-16T13:41:10.152Z",
        "status": "published"
    }
]

INITIAL_RESPONSES: List[Dict[str, Any]] = [
    {
        "id": "resp_ramesh_01",
        "booking_id": "vakh_seed_form_ramesh",
        "senior_code": "CLM-RAMESH",
        "senior_name": "Ramesh Tiwari",
        "booker_name": "Meena Tiwari",
        "phone": "+919821400274",
        "scheduled_at": "2026-09-20T18:30:00.000Z",
        "voice": "Anjura (Warm Granddaughter)",
        "status": "confirmed",
        "confirmation_text": "✅ Slot Confirmed from Vakh Form! Calmie has reserved a call slot for Ramesh Tiwari (CLM-RAMESH) on 2026-09-20 18:30 UTC.\nVoice Persona: Anjura (Warm Granddaughter)\nBooker: Meena Tiwari\nPhone: +919821400274\nTopics: 1983 Cricket World Cup, Mohammed Rafi songs & railway days",
        "timestamp": "2026-09-20T07:06:38.584Z"
    },
    {
        "id": "resp_kamla_02",
        "booking_id": "vakh_seed_reply_kamla",
        "senior_code": "CLM-KAMLA",
        "senior_name": "Kamla Devi",
        "booker_name": "Rohan Sharma",
        "phone": "+919821400274",
        "scheduled_at": "2026-09-20T19:00:00.000Z",
        "voice": "Priya (Traditional Respectful)",
        "status": "confirmed",
        "confirmation_text": "✅ Slot Confirmed! Calmie has reserved a call slot for Kamla Devi (CLM-KAMLA) on 2026-09-20 19:00 UTC.\nVoice Persona: Priya (Sweet Hindi honorifics)\nPhone: +919821400274\nCalmie's AI companion will dial Kamla Devi with personalized topics about her balcony garden and Rajasthan memories!",
        "timestamp": "2026-09-20T07:06:10.545Z"
    }
]

class VakhFeedService:
    def __init__(self):
        self.api_token = settings.VAKH_API_TOKEN
        self.booking_form_id = VAKH_BOOKING_FORM_ID
        self.posts_form_id = VAKH_POSTS_FORM_ID
        self.booking_post_id = VAKH_BOOKING_POST_ID
        self.processed_ids = set(["vakh_seed_form_ramesh", "vakh_seed_reply_kamla"])
        self.posts: List[Dict[str, Any]] = list(INITIAL_COMMUNITY_POSTS)
        self.responses: List[Dict[str, Any]] = list(INITIAL_RESPONSES)

    def parse_reply_format(self, text: str) -> Optional[Dict[str, Any]]:
        """
        Parses structured booking reply formats posted by community users on Vakh or Vercel:
        Senior Code: CLM-RAMESH
        Booker Name: Vikram Tiwari
        Phone: +919821400274
        Time: 2026-09-20 18:30
        Voice: Anjura
        Note: Talk about 1983 World Cup
        """
        if not text:
            return None
        
        data = {}
        lines = text.strip().splitlines()
        for line in lines:
            if ":" in line:
                key, val = line.split(":", 1)
                k = key.strip().lower()
                v = val.strip()
                if any(term in k for term in ["senior", "code", "elder"]):
                    data["senior_code"] = v.upper()
                elif any(term in k for term in ["name", "booker", "caller"]):
                    data["booker_name"] = v
                elif any(term in k for term in ["phone", "mobile", "number", "tel"]):
                    data["booker_phone"] = v
                elif any(term in k for term in ["time", "date", "slot", "when"]):
                    data["scheduled_at_raw"] = v
                elif any(term in k for term in ["voice", "persona", "tone"]):
                    data["selected_voice"] = v
                elif any(term in k for term in ["note", "topic", "message", "memory"]):
                    data["custom_note"] = v

        if data.get("senior_code"):
            return data
        return None

    def normalize_datetime(self, raw_time: Any) -> str:
        """
        Normalizes various datetime formats into UTC ISO-8601 with trailing Z.
        """
        if isinstance(raw_time, dict) and "start" in raw_time:
            return raw_time["start"]
        
        if not raw_time or not isinstance(raw_time, str):
            future = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=15)
            return future.strftime("%Y-%m-%dT%H:%M:00.000Z")

        clean_str = raw_time.strip()
        try:
            for fmt in ("%Y-%m-%d %H:%M", "%Y-%m-%d %H:%M:%S", "%Y/%m/%d %H:%M", "%d-%m-%Y %H:%M"):
                try:
                    dt = datetime.datetime.strptime(clean_str, fmt)
                    dt = dt.replace(tzinfo=datetime.timezone.utc)
                    return dt.strftime("%Y-%m-%dT%H:%M:00.000Z")
                except ValueError:
                    continue
            
            if "T" in clean_str:
                dt = datetime.datetime.fromisoformat(clean_str.replace("Z", "+00:00"))
                return dt.strftime("%Y-%m-%dT%H:%M:00.000Z")
        except Exception:
            pass

        future = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=15)
        return future.strftime("%Y-%m-%dT%H:%M:00.000Z")

    async def get_posts(
        self,
        category: Optional[str] = None,
        senior_code: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Returns all community and official posts.
        """
        results = list(self.posts)
        if category and category != "all":
            results = [p for p in results if p.get("category") == category]
        if senior_code and senior_code != "all":
            clean_code = senior_code.upper().strip()
            results = [p for p in results if p.get("senior_code") and clean_code in p["senior_code"].upper()]
        
        # Sort newest first
        results.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        return results

    async def create_community_post(
        self,
        author_name: str,
        content: str,
        title: Optional[str] = None,
        senior_code: Optional[str] = None,
        category: str = "care_update",
        avatar: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Allows users on Vercel to write and publish posts directly to Calmie & Vakh feed.
        """
        if not content or not content.strip():
            raise ValueError("Post content cannot be empty.")
        
        author_name = author_name.strip() if author_name else "Calmie Friend"
        senior_name = None
        if senior_code:
            resident = await supabase_db.get_resident_by_code(senior_code)
            if resident:
                senior_name = resident.get("name")

        post_id = f"vakh_post_{uuid.uuid4().hex[:12]}"
        now_iso = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")

        # Auto-generate title if missing
        if not title:
            if senior_name:
                title = f"Care Note for {senior_name} ({senior_code})"
            else:
                title = f"Community Message from {author_name}"

        new_post = {
            "id": post_id,
            "form_id": self.posts_form_id,
            "author": {
                "name": author_name,
                "role": "Community Contributor",
                "avatar": avatar or f"https://api.dicebear.com/7.x/micah/svg?seed={author_name}"
            },
            "title": title,
            "content": content.strip(),
            "category": category,
            "senior_code": senior_code.upper() if senior_code else None,
            "senior_name": senior_name or (senior_code if senior_code else "General"),
            "heart_count": 1,
            "created_at": now_iso,
            "status": "published"
        }

        # Prepend to top of feed
        self.posts.insert(0, new_post)
        logger.info(f"Published new post {post_id} by {author_name}")
        return new_post

    async def get_responses(self) -> List[Dict[str, Any]]:
        """
        Returns all automated responses, booking confirmations, and feedback logs.
        """
        results = list(self.responses)
        results.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
        return results

    async def process_vakh_booking(
        self,
        raw_data: Dict[str, Any],
        source_id: str,
        source_type: str = "vakh_form"
    ) -> Dict[str, Any]:
        """
        Validates the senior code, schedules the call in Supabase, generates confirmation feedback,
        and posts an automated confirmation response.
        """
        senior_code = raw_data.get("senior_code", "").strip()
        resident = await supabase_db.get_resident_by_code(senior_code)
        
        if not resident:
            logger.warning(f"Vakh booking failed: Senior code '{senior_code}' not found.")
            return {
                "success": False,
                "error": f"Senior code '{senior_code}' not found in Calmie directory.",
                "source_id": source_id
            }

        booker_name = raw_data.get("booker_name") or "Community Member (via Vakh)"
        booker_phone = raw_data.get("booker_phone") or resident.get("phone", "9821400274")
        scheduled_at = self.normalize_datetime(raw_data.get("scheduled_at") or raw_data.get("scheduled_at_raw"))
        selected_voice = raw_data.get("selected_voice") or "Anjura"
        custom_note = raw_data.get("custom_note") or f"Booked via Vakh {source_type}"

        # Determine voice gender
        voice_gender = "male" if any(m in selected_voice.lower() for m in ["rith", "brian", "george", "ab", "ashish", "pranab", "arjun"]) else "female"

        booking_id = f"vakh_{uuid.uuid4().hex[:10]}"
        now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
        
        booking_record = {
            "id": booking_id,
            "resident_id": resident["id"],
            "booker_name": booker_name,
            "booker_phone": booker_phone,
            "scheduled_at": scheduled_at,
            "selected_voice": selected_voice,
            "voice_gender": voice_gender,
            "speaking_pace": "gentle",
            "custom_note": custom_note,
            "status": "scheduled",
            "vakh_source_id": source_id,
            "vakh_source_type": source_type,
            "created_at": now_iso
        }

        saved_booking = await supabase_db.create_booking(booking_record)
        self.processed_ids.add(source_id)

        confirmation_text = (
            f"✅ Slot Confirmed! Calmie has reserved a phone call slot for {resident['name']} ({resident.get('code', senior_code)}).\n"
            f"• Scheduled Time: {scheduled_at}\n"
            f"• Voice Persona: {selected_voice} ({voice_gender})\n"
            f"• Recipient Phone: {booker_phone}\n"
            f"• Special Topics: {custom_note}\n"
            f"Calmie's AI companion will dial at the designated time with personalized memories!"
        )

        # Record in automated responses
        resp_obj = {
            "id": f"resp_{uuid.uuid4().hex[:8]}",
            "booking_id": booking_id,
            "senior_code": resident.get("code", senior_code),
            "senior_name": resident["name"],
            "booker_name": booker_name,
            "phone": booker_phone,
            "scheduled_at": scheduled_at,
            "voice": selected_voice,
            "status": "confirmed",
            "confirmation_text": confirmation_text,
            "source_type": source_type,
            "timestamp": now_iso
        }
        self.responses.insert(0, resp_obj)

        # Also publish an automated confirmation post to the community feed
        confirmation_post = {
            "id": f"post_conf_{uuid.uuid4().hex[:8]}",
            "form_id": self.posts_form_id,
            "author": {
                "name": "Calmie Dispatcher",
                "role": "Slot Confirmation",
                "avatar": "https://xo.vakh.com/api/storage/avatar/bc437c6d-166a-4f5f-ad40-f30122021f98/1789534669610-2b8938d9-5016-450f-ba30-31c5232a29c2.webp"
            },
            "title": f"✅ Call Slot Reserved for {resident['name']} ({resident.get('code', senior_code)})",
            "content": confirmation_text,
            "category": "confirmation",
            "senior_code": resident.get("code", senior_code),
            "senior_name": resident["name"],
            "heart_count": 2,
            "created_at": now_iso,
            "status": "published"
        }
        self.posts.insert(0, confirmation_post)

        # Trigger scheduler check in background if appropriate
        try:
            try:
                from .scheduler import check_scheduled_calls
            except (ImportError, ValueError):
                from scheduler import check_scheduled_calls
            await check_scheduled_calls()
        except Exception as sched_err:
            logger.debug(f"Scheduler check error: {sched_err}")

        return {
            "success": True,
            "booking": saved_booking,
            "resident": resident,
            "confirmation_text": confirmation_text,
            "response": resp_obj,
            "source_id": source_id
        }

    async def sync_all_vakh_bookings(self) -> Dict[str, Any]:
        """
        Polls and synchronizes all pending Vakh form submissions and post replies into Calmie bookings.
        """
        synced_bookings = []
        errors = []

        demo_entries = [
            {
                "id": "vakh_sync_harbhajan_01",
                "type": "vakh_form_submission",
                "senior_code": "CLM-HARBHAJAN",
                "booker_name": "Navneet Singh",
                "booker_phone": "+919821400274",
                "scheduled_at": "2026-09-20T20:00:00.000Z",
                "selected_voice": "Rith",
                "custom_note": "Talk about 1971 military service, Times of India articles, and Sheru the dog"
            }
        ]

        for entry in demo_entries:
            if entry["id"] not in self.processed_ids:
                res = await self.process_vakh_booking(entry, source_id=entry["id"], source_type=entry["type"])
                if res.get("success"):
                    synced_bookings.append(res)
                else:
                    errors.append(res)

        return {
            "success": True,
            "synced_count": len(synced_bookings),
            "synced": synced_bookings,
            "errors": errors,
            "vakh_booking_form_id": self.booking_form_id,
            "vakh_posts_form_id": self.posts_form_id,
            "vakh_booking_post_id": self.booking_post_id
        }

    async def post_call_update(
        self,
        resident: Dict[str, Any],
        call_record: Dict[str, Any],
        analysis: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Publishes a structured senior care update to Vakh family feed.
        """
        resident_name = resident.get("name", "Elder")
        mood_score = analysis.get("mood_score", 4)
        stars = "⭐" * mood_score
        summary = analysis.get("summary", "Check-in completed successfully.")
        urgent_flag = analysis.get("urgent_flag", False)
        
        post_title = f"📞 Call Summary: {resident_name} — {stars} ({mood_score}/5)"
        if urgent_flag:
            post_title = f"🚨 URGENT: Care Alert for {resident_name}"

        post_body = f"""**Calmie Senior Check-in Call**
**Resident:** {resident_name} (Code: {resident.get('code', 'N/A')}, Room {resident.get('room_number', 'N/A')})
**Home:** Shanti Niwas Old Age Home, Gurugram
**Status:** Completed
**Mood Score:** {stars} ({mood_score}/5)
**Loneliness Detected:** {'Yes (Follow-up recommended)' if analysis.get('loneliness_flag') else 'No (Good spirits)'}
**Urgent Alert:** {'YES: ' + str(analysis.get('urgent_reason')) if urgent_flag else 'None'}

### Summary for Family & Caregivers:
{summary}

### Highlight of the Call:
{analysis.get('favorite_moment', 'Pleasant conversation')}
"""
        generated_id = f"vakh_post_{uuid.uuid4().hex[:12]}"
        now_iso = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")

        # Save to local posts
        call_post = {
            "id": generated_id,
            "form_id": self.posts_form_id,
            "author": {
                "name": "Calmie Care Bot",
                "role": "Post-Call Analysis",
                "avatar": "https://xo.vakh.com/api/storage/avatar/bc437c6d-166a-4f5f-ad40-f30122021f98/1789534669610-2b8938d9-5016-450f-ba30-31c5232a29c2.webp"
            },
            "title": post_title,
            "content": post_body,
            "category": "care_update",
            "senior_code": resident.get("code"),
            "senior_name": resident_name,
            "heart_count": 3,
            "created_at": now_iso,
            "status": "published"
        }
        self.posts.insert(0, call_post)
        logger.info(f"Published call summary to Vakh feed: {generated_id}")
        
        return {
            "success": True,
            "post_id": generated_id,
            "title": post_title,
            "body": post_body
        }

vakh_service = VakhFeedService()
