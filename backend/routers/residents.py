from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
try:
    from ..supabase_client import supabase_db
except (ImportError, ValueError):
    from supabase_client import supabase_db

router = APIRouter(prefix="/api/residents", tags=["Residents"])

class ResidentCreate(BaseModel):
    name: str
    age: int
    home_id: Optional[str] = "7395f58b-3ec9-4d30-a72a-7c3ec754f416"
    phone: str = "9821400274"
    room_number: Optional[str] = ""
    photo_url: Optional[str] = ""
    hometown: Optional[str] = ""
    family_notes: Optional[str] = ""
    hobbies: Optional[str] = ""
    health_notes: Optional[str] = ""
    personality: Optional[str] = ""
    preferred_lang: Optional[str] = "Hindi with English mix"
    favorite_topics: Optional[str] = ""
    avoid_topics: Optional[str] = ""

@router.get("", response_model=List[Dict[str, Any]])
async def list_residents(home_id: Optional[str] = Query(None)):
    residents = await supabase_db.get_residents(home_id=home_id)
    return residents

@router.get("/{resident_id}", response_model=Dict[str, Any])
async def get_resident(resident_id: str):
    resident = await supabase_db.get_resident_by_id(resident_id)
    if not resident:
        raise HTTPException(status_code=404, detail="Resident not found")
    return resident

@router.get("/{resident_id}/availability", response_model=List[Dict[str, Any]])
async def get_resident_availability(resident_id: str):
    slots = await supabase_db.get_availability(resident_id)
    return slots

@router.post("", response_model=Dict[str, Any])
async def create_resident(payload: ResidentCreate):
    data = payload.model_dump()
    created = await supabase_db.create_resident(data)
    return created
