from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
import datetime
try:
    from ..supabase_client import supabase_db
except (ImportError, ValueError):
    from supabase_client import supabase_db

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])

class BookingCreate(BaseModel):
    resident_id: str
    booker_name: str
    booker_phone: str
    booker_email: Optional[str] = ""
    scheduled_at: Optional[str] = None
    custom_note: Optional[str] = ""
    selected_voice: Optional[str] = "Aria (Warm & Cheerful)"
    voice_gender: Optional[str] = "female"
    speaking_pace: Optional[str] = "gentle"

@router.post("", response_model=Dict[str, Any])
async def create_booking(payload: BookingCreate):
    resident = await supabase_db.get_resident_by_id(payload.resident_id)
    if not resident:
        raise HTTPException(status_code=404, detail="Resident not found")

    scheduled_time = payload.scheduled_at
    if not scheduled_time:
        scheduled_time = datetime.datetime.now(datetime.timezone.utc).isoformat()

    booking_data = {
        "resident_id": payload.resident_id,
        "booker_name": payload.booker_name,
        "booker_phone": payload.booker_phone,
        "booker_email": payload.booker_email,
        "scheduled_at": scheduled_time,
        "status": "scheduled",
        "custom_note": payload.custom_note,
        "selected_voice": payload.selected_voice,
        "voice_gender": payload.voice_gender,
        "speaking_pace": payload.speaking_pace
    }

    created = await supabase_db.create_booking(booking_data)
    # Include resident snapshot for the confirmation UI
    created["resident"] = resident
    return created

@router.get("/{booking_id}", response_model=Dict[str, Any])
async def get_booking(booking_id: str):
    booking = await supabase_db.get_booking_by_id(booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    resident = await supabase_db.get_resident_by_id(booking.get("resident_id", ""))
    booking["resident"] = resident
    return booking
