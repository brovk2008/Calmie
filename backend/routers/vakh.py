import logging
from fastapi import APIRouter, HTTPException
from typing import Dict, Any, Optional
from pydantic import BaseModel
try:
    from ..services.vakh_service import vakh_service, VAKH_BOOKING_FORM_ID, VAKH_BOOKING_POST_ID
    from ..supabase_client import supabase_db
except (ImportError, ValueError):
    from services.vakh_service import vakh_service, VAKH_BOOKING_FORM_ID, VAKH_BOOKING_POST_ID
    from supabase_client import supabase_db

logger = logging.getLogger("calmie.vakh_router")
router = APIRouter(prefix="/api/vakh", tags=["Vakh Integration"])

class VakhReplyBookingRequest(BaseModel):
    reply_text: str
    post_id: Optional[str] = None

class VakhFormBookingRequest(BaseModel):
    senior_code: str
    booker_name: str
    booker_phone: str
    scheduled_at: str
    selected_voice: Optional[str] = "Anjura"
    custom_note: Optional[str] = None

@router.get("/info")
async def get_vakh_info() -> Dict[str, Any]:
    """
    Returns Vakh integration configuration, form/post IDs, senior codes, and template formats.
    """
    residents = await supabase_db.get_residents()
    senior_directory = [
        {
            "id": r.get("id"),
            "name": r.get("name"),
            "code": r.get("code"),
            "room_number": r.get("room_number"),
            "photo_url": r.get("photo_url")
        }
        for r in residents
    ]

    reply_template = (
        "Senior Code: CLM-RAMESH\n"
        "Booker Name: Vikram Tiwari\n"
        "Phone: +919821400274\n"
        "Time: 2026-09-20 18:30\n"
        "Voice: Anjura\n"
        "Note: Talk about 1983 World Cup and Mohammed Rafi songs"
    )

    return {
        "booking_form_id": VAKH_BOOKING_FORM_ID,
        "booking_form_url": f"https://xo.vakh.com/form/{VAKH_BOOKING_FORM_ID}",
        "booking_post_id": VAKH_BOOKING_POST_ID,
        "reply_template": reply_template,
        "senior_directory": senior_directory
    }

@router.post("/sync")
async def sync_vakh() -> Dict[str, Any]:
    """
    Triggers automated sync of Vakh form submissions and post replies.
    """
    result = await vakh_service.sync_all_vakh_bookings()
    return result

@router.post("/book-reply")
async def book_via_reply(payload: VakhReplyBookingRequest) -> Dict[str, Any]:
    """
    Processes a raw reply string formatted by a Vakh community member.
    """
    parsed = vakh_service.parse_reply_format(payload.reply_text)
    if not parsed:
        raise HTTPException(
            status_code=400,
            detail="Could not parse booking format. Make sure to specify 'Senior Code:', 'Booker Name:', and 'Phone:'."
        )

    res = await vakh_service.process_vakh_booking(
        parsed,
        source_id=payload.post_id or f"manual_reply_{id(payload)}",
        source_type="vakh_post_reply"
    )
    if not res.get("success"):
        raise HTTPException(status_code=400, detail=res.get("error", "Booking failed"))

    return res

@router.post("/book-form")
async def book_via_form(payload: VakhFormBookingRequest) -> Dict[str, Any]:
    """
    Processes a structured Vakh booking form submission.
    """
    data = payload.model_dump()
    res = await vakh_service.process_vakh_booking(
        data,
        source_id=f"vakh_form_{id(payload)}",
        source_type="vakh_form_submission"
    )
    if not res.get("success"):
        raise HTTPException(status_code=400, detail=res.get("error", "Booking failed"))

    return res
