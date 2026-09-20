import logging
from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, Optional, List
from pydantic import BaseModel, Field
try:
    from ..services.vakh_service import (
        vakh_service,
        VAKH_BOOKING_FORM_ID,
        VAKH_POSTS_FORM_ID,
        VAKH_BOOKING_POST_ID
    )
    from ..supabase_client import supabase_db
except (ImportError, ValueError):
    from services.vakh_service import (
        vakh_service,
        VAKH_BOOKING_FORM_ID,
        VAKH_POSTS_FORM_ID,
        VAKH_BOOKING_POST_ID
    )
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

class VakhCreatePostRequest(BaseModel):
    author_name: str = Field(default="Calmie Supporter")
    title: Optional[str] = None
    content: str
    senior_code: Optional[str] = None
    category: Optional[str] = "care_update"
    avatar: Optional[str] = None

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
            "photo_url": r.get("photo_url"),
            "preferred_lang": r.get("preferred_lang"),
            "favorite_topics": r.get("favorite_topics")
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
        "booking_form_name": "Calmie Senior Call Slot Bookings",
        "booking_form_url": f"https://xo.vakh.com/form/{VAKH_BOOKING_FORM_ID}",
        "posts_form_id": VAKH_POSTS_FORM_ID,
        "posts_form_name": "Calmie",
        "posts_form_url": f"https://xo.vakh.com/form/{VAKH_POSTS_FORM_ID}",
        "booking_post_id": VAKH_BOOKING_POST_ID,
        "booking_post_url": f"https://xo.vakh.com/post/{VAKH_BOOKING_POST_ID}",
        "reply_template": reply_template,
        "senior_directory": senior_directory
    }

@router.get("/posts")
async def get_posts(
    category: Optional[str] = Query(None, description="Filter by category"),
    senior_code: Optional[str] = Query(None, description="Filter by senior code")
) -> Dict[str, Any]:
    """
    Retrieves all published community posts, slot confirmations, announcements, and call summaries.
    """
    posts = await vakh_service.get_posts(category=category, senior_code=senior_code)
    return {
        "success": True,
        "count": len(posts),
        "form_id": VAKH_POSTS_FORM_ID,
        "form_name": "Calmie",
        "posts": posts
    }

@router.post("/create-post")
async def create_post(payload: VakhCreatePostRequest) -> Dict[str, Any]:
    """
    Allows people on Vercel to write and publish a post directly to the Calmie feed.
    """
    try:
        new_post = await vakh_service.create_community_post(
            author_name=payload.author_name,
            content=payload.content,
            title=payload.title,
            senior_code=payload.senior_code,
            category=payload.category or "care_update",
            avatar=payload.avatar
        )
        return {
            "success": True,
            "message": "Post published successfully to Calmie feed!",
            "post": new_post
        }
    except ValueError as val_err:
        raise HTTPException(status_code=400, detail=str(val_err))
    except Exception as e:
        logger.error(f"Failed to create post: {e}")
        raise HTTPException(status_code=500, detail="Failed to publish post.")

@router.get("/responses")
async def get_responses() -> Dict[str, Any]:
    """
    Returns all automated booking confirmations and slot responses.
    """
    responses = await vakh_service.get_responses()
    return {
        "success": True,
        "count": len(responses),
        "responses": responses
    }

@router.post("/book-reply")
async def book_via_reply(payload: VakhReplyBookingRequest) -> Dict[str, Any]:
    """
    Processes a raw reply string formatted by a Vakh community member and posts an automated response.
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
    Processes a structured Vakh booking form submission and posts an automated response.
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

@router.post("/sync")
async def sync_vakh() -> Dict[str, Any]:
    """
    Triggers automated sync of Vakh form submissions and post replies.
    """
    result = await vakh_service.sync_all_vakh_bookings()
    return result
