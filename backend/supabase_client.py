import logging
from typing import Any, Dict, List, Optional
import httpx
from .config import settings

logger = logging.getLogger("calmie.supabase")

# Fallback seed data in case network is disconnected
DEFAULT_HOMES = [
    {
        "id": "7395f58b-3ec9-4d30-a72a-7c3ec754f416",
        "name": "Shanti Niwas Old Age Home",
        "address": "Sector 21",
        "city": "Gurugram, Haryana",
        "pincode": "122016",
        "contact_name": "Ramesh Sharma",
        "contact_phone": "+919810000001",
        "contact_email": "contact@shantiniwas.org",
        "approved": True
    }
]

DEFAULT_RESIDENTS = [
    {
        "id": "95c6eaba-fda4-44c0-8d8e-d13d9211808e",
        "home_id": "7395f58b-3ec9-4d30-a72a-7c3ec754f416",
        "name": "Ramesh Tiwari",
        "age": 79,
        "phone": "9821400274",
        "room_number": "104",
        "photo_url": "/residents/ramesh.jpg",
        "hometown": "Allahabad (now Prayagraj), UP",
        "family_notes": "Son Vikram lives in Noida, daughter Meena in Canada. Vikram visits once a month. Meena calls every Sunday.",
        "hobbies": "Cricket (huge fan since 1983 World Cup), chess, listening to old Mohammed Rafi songs",
        "health_notes": "Slight hearing loss in left ear. Ask him to speak up if needed. No dementia.",
        "personality": "Very talkative. Loves telling stories about his railway job (retired station master). Laughs easily. Repeats himself sometimes — that is fine.",
        "preferred_lang": "Hindi with some English words",
        "favorite_topics": "1983 Cricket World Cup, Indian Railways, partition stories his father told him, Mohammed Rafi",
        "avoid_topics": "His wife Savitri who passed 2 years ago — do not bring up unless he does",
        "vakh_form_id": None,
        "active": True
    },
    {
        "id": "d9cde304-cad5-4d9c-ab22-2a169e3846d2",
        "home_id": "7395f58b-3ec9-4d30-a72a-7c3ec754f416",
        "name": "Kamla Devi",
        "age": 74,
        "phone": "9821400274",
        "room_number": "108",
        "photo_url": "/residents/kamla.jpg",
        "hometown": "Jaipur, Rajasthan",
        "family_notes": "Three sons, none in Gurugram. Calls them every Saturday. Feels the distance.",
        "hobbies": "Bhajan singing, reading Ramcharitmanas, watching nature documentaries, watering her balcony plants",
        "health_notes": "Type 2 diabetes — keep conversations low stress. No mobility issues. Very sharp mind.",
        "personality": "Calm, thoughtful, philosophical. Not very talkative unless asked the right question. Warms up when asked about spirituality or her garden.",
        "preferred_lang": "Hindi (prefers), basic English understood",
        "favorite_topics": "Bhakti poetry, Rajasthan memories, her garden, her grandchildren's studies",
        "avoid_topics": "None specified",
        "vakh_form_id": None,
        "active": True
    },
    {
        "id": "f1e8c218-bf30-44ed-84d4-6a129b12d99d",
        "home_id": "7395f58b-3ec9-4d30-a72a-7c3ec754f416",
        "name": "Col. (Retd.) Harbhajan Singh",
        "age": 82,
        "phone": "9821400274",
        "room_number": "201",
        "photo_url": "/residents/harbhajan.jpg",
        "hometown": "Ludhiana, Punjab",
        "family_notes": "Widower. Daughter Navneet in Singapore, keeps in touch on video call. Proud of her but misses her. Has a dog named Sheru.",
        "hobbies": "Reading newspapers (Times of India, daily), chess, talking about military history and 1971 war",
        "health_notes": "Hearing is excellent. Sometimes gets breathless — do not keep call over 8 min.",
        "personality": "Formal, dignified. Calls himself \"Colonel.\" Warms up when addressed respectfully. Loves being asked his opinion on current affairs. Dry sense of humor.",
        "preferred_lang": "English and Punjabi mix, formal register",
        "favorite_topics": "1971 India-Pakistan war, Punjab, Indian Army, chess, Sheru the dog, Navneet",
        "avoid_topics": "Partition violence — too personal",
        "vakh_form_id": None,
        "active": True
    }
]

class SupabaseService:
    def __init__(self):
        self.url = settings.SUPABASE_URL
        self.key = settings.SUPABASE_ANON_KEY
        self.headers = {
            "apikey": self.key,
            "Authorization": f"Bearer {self.key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
        # In-memory storage for bookings and calls created during demo
        self.local_bookings: List[Dict[str, Any]] = []
        self.local_calls: List[Dict[str, Any]] = []
        self.local_residents: List[Dict[str, Any]] = list(DEFAULT_RESIDENTS)

    async def get_homes(self) -> List[Dict[str, Any]]:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(f"{self.url}/rest/v1/homes?select=*", headers=self.headers)
                if res.status_code == 200:
                    data = res.json()
                    if data:
                        return data
        except Exception as e:
            logger.warning(f"Supabase get_homes failed, using fallback: {e}")
        return DEFAULT_HOMES

    async def get_residents(self, home_id: Optional[str] = None) -> List[Dict[str, Any]]:
        try:
            url = f"{self.url}/rest/v1/residents?select=*"
            if home_id:
                url += f"&home_id=eq.{home_id}"
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(url, headers=self.headers)
                if res.status_code == 200:
                    data = res.json()
                    if data:
                        # merge any local created ones
                        return data
        except Exception as e:
            logger.warning(f"Supabase get_residents failed, using fallback: {e}")
        return self.local_residents

    async def get_resident_by_id(self, resident_id: str) -> Optional[Dict[str, Any]]:
        try:
            url = f"{self.url}/rest/v1/residents?id=eq.{resident_id}&select=*"
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(url, headers=self.headers)
                if res.status_code == 200:
                    data = res.json()
                    if data:
                        return data[0]
        except Exception as e:
            logger.warning(f"Supabase get_resident_by_id failed: {e}")
        
        # Check local fallback
        for r in self.local_residents:
            if str(r.get("id")) == str(resident_id):
                return r
        return None

    async def create_resident(self, resident_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(f"{self.url}/rest/v1/residents", headers=self.headers, json=resident_data)
                if res.status_code in (200, 201):
                    data = res.json()
                    if data:
                        return data[0]
        except Exception as e:
            logger.warning(f"Supabase create_resident failed, saving locally: {e}")
        
        import uuid
        resident_data["id"] = resident_data.get("id") or str(uuid.uuid4())
        self.local_residents.append(resident_data)
        return resident_data

    async def get_availability(self, resident_id: str) -> List[Dict[str, Any]]:
        try:
            url = f"{self.url}/rest/v1/availability?resident_id=eq.{resident_id}&select=*"
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(url, headers=self.headers)
                if res.status_code == 200:
                    return res.json()
        except Exception as e:
            logger.warning(f"Supabase get_availability failed: {e}")
        return [
            {"day_of_week": 1, "start_time": "10:00", "end_time": "12:00", "active": True},
            {"day_of_week": 3, "start_time": "16:00", "end_time": "18:00", "active": True}
        ]

    async def create_booking(self, booking_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(f"{self.url}/rest/v1/bookings", headers=self.headers, json=booking_data)
                if res.status_code in (200, 201):
                    data = res.json()
                    if data:
                        return data[0]
        except Exception as e:
            logger.warning(f"Supabase create_booking failed: {e}")
        
        import uuid
        booking_data["id"] = booking_data.get("id") or str(uuid.uuid4())
        self.local_bookings.append(booking_data)
        return booking_data

    async def get_booking_by_id(self, booking_id: str) -> Optional[Dict[str, Any]]:
        try:
            url = f"{self.url}/rest/v1/bookings?id=eq.{booking_id}&select=*"
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(url, headers=self.headers)
                if res.status_code == 200:
                    data = res.json()
                    if data:
                        return data[0]
        except Exception as e:
            logger.warning(f"Supabase get_booking_by_id failed: {e}")
        
        for b in self.local_bookings:
            if str(b.get("id")) == str(booking_id):
                return b
        return None

    async def create_or_update_call(self, call_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                # check if call exists by twilio_call_sid or id
                cid = call_data.get("id")
                csid = call_data.get("twilio_call_sid")
                
                if cid:
                    check_url = f"{self.url}/rest/v1/calls?id=eq.{cid}&select=*"
                elif csid:
                    check_url = f"{self.url}/rest/v1/calls?twilio_call_sid=eq.{csid}&select=*"
                else:
                    check_url = None

                if check_url:
                    existing = await client.get(check_url, headers=self.headers)
                    if existing.status_code == 200 and existing.json():
                        existing_id = existing.json()[0]["id"]
                        patch_res = await client.patch(
                            f"{self.url}/rest/v1/calls?id=eq.{existing_id}",
                            headers=self.headers,
                            json=call_data
                        )
                        if patch_res.status_code == 200:
                            return patch_res.json()[0]

                res = await client.post(f"{self.url}/rest/v1/calls", headers=self.headers, json=call_data)
                if res.status_code in (200, 201):
                    data = res.json()
                    if data:
                        return data[0]
        except Exception as e:
            logger.warning(f"Supabase call sync failed: {e}")

        import uuid
        if not call_data.get("id"):
            call_data["id"] = str(uuid.uuid4())
        # update in memory
        found = False
        for idx, c in enumerate(self.local_calls):
            if c.get("id") == call_data["id"] or (call_data.get("twilio_call_sid") and c.get("twilio_call_sid") == call_data.get("twilio_call_sid")):
                self.local_calls[idx].update(call_data)
                found = True
                break
        if not found:
            self.local_calls.append(call_data)
        return call_data

    async def get_calls(self, limit: int = 50) -> List[Dict[str, Any]]:
        try:
            url = f"{self.url}/rest/v1/calls?select=*&order=created_at.desc&limit={limit}"
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(url, headers=self.headers)
                if res.status_code == 200:
                    data = res.json()
                    if data:
                        return data
        except Exception as e:
            logger.warning(f"Supabase get_calls failed: {e}")
        return sorted(self.local_calls, key=lambda x: x.get("created_at", ""), reverse=True)

supabase_db = SupabaseService()
