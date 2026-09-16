from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
try:
    from ..supabase_client import supabase_db
except (ImportError, ValueError):
    from supabase_client import supabase_db

router = APIRouter(prefix="/api/homes", tags=["Homes"])

@router.get("", response_model=List[Dict[str, Any]])
async def list_homes():
    homes = await supabase_db.get_homes()
    return homes

@router.get("/{home_id}", response_model=Dict[str, Any])
async def get_home(home_id: str):
    homes = await supabase_db.get_homes()
    for h in homes:
        if str(h.get("id")) == str(home_id):
            return h
    raise HTTPException(status_code=404, detail="Care home not found")
