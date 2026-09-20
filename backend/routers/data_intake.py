"""
Data Intake API — Resident onboarding via manual form or PDF/image upload with Claude Vision OCR.
Routes:
  GET  /api/intake/template        — download blank intake form PDF
  POST /api/intake/resident        — create a single resident via JSON form
  POST /api/intake/upload          — upload PDF/image, returns parsed preview list
  POST /api/intake/bulk-confirm    — commit a list of pre-parsed residents to DB
"""
import logging
import uuid
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import Response
from pydantic import BaseModel

try:
    from ..supabase_client import supabase_db
    from ..services.ocr_service import ocr_service
    from ..services.template_generator import generate_intake_template
except (ImportError, ValueError):
    from supabase_client import supabase_db
    from services.ocr_service import ocr_service
    from services.template_generator import generate_intake_template

logger = logging.getLogger("calmie.intake")
router = APIRouter(prefix="/api/intake", tags=["intake"])


# ── Models ──────────────────────────────────────────────────────────────────

class ResidentIntakeForm(BaseModel):
    home_id: Optional[str] = None
    name: str
    age: Optional[int] = None
    room_number: Optional[str] = None
    phone: Optional[str] = None
    hometown: Optional[str] = None
    preferred_lang: Optional[str] = None
    hobbies: Optional[str] = None
    favorite_topics: Optional[str] = None
    avoid_topics: Optional[str] = None
    health_notes: Optional[str] = None
    family_notes: Optional[str] = None
    personality: Optional[str] = None
    emergency_contact: Optional[str] = None
    photo_url: Optional[str] = None


class BulkConfirmRequest(BaseModel):
    home_id: Optional[str] = None
    residents: List[Dict[str, Any]]


# ── Helpers ──────────────────────────────────────────────────────────────────

def _generate_code(name: str) -> str:
    """Generate a unique CLM- code from a resident name."""
    first = "".join(c for c in name.upper().split()[0] if c.isalnum())[:10]
    suffix = uuid.uuid4().hex[:4].upper()
    return f"CLM-{first}-{suffix}"


def _prepare_resident(data: Dict[str, Any], home_id: Optional[str]) -> Dict[str, Any]:
    """Normalize and enrich a resident dict before DB insertion."""
    name = data.get("name") or data.get("full_name") or ""
    return {
        "id": str(uuid.uuid4()),
        "home_id": home_id or data.get("home_id"),
        "name": name.strip(),
        "code": _generate_code(name) if name else f"CLM-{uuid.uuid4().hex[:6].upper()}",
        "age": data.get("age"),
        "room_number": data.get("room_number"),
        "phone": str(data.get("phone") or "").strip() or None,
        "hometown": data.get("hometown"),
        "preferred_lang": data.get("preferred_lang") or data.get("languages"),
        "hobbies": data.get("hobbies"),
        "favorite_topics": data.get("favorite_topics"),
        "avoid_topics": data.get("avoid_topics"),
        "health_notes": data.get("health_notes"),
        "family_notes": data.get("family_notes"),
        "personality": data.get("personality"),
        "emergency_contact": data.get("emergency_contact"),
        "photo_url": data.get("photo_url") or "/residents/default.jpg",
        "active": True,
    }


# ── Routes ───────────────────────────────────────────────────────────────────

@router.get("/template")
async def download_template():
    """Download the blank Calmie Resident Intake Form PDF."""
    try:
        pdf_bytes = generate_intake_template()
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": 'attachment; filename="calmie_intake_form.pdf"'},
        )
    except Exception as e:
        logger.error(f"Template generation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Could not generate template: {e}")


@router.post("/resident")
async def create_resident_manual(form: ResidentIntakeForm):
    """Create a single resident via JSON form submission."""
    if not form.name or not form.name.strip():
        raise HTTPException(status_code=400, detail="Resident name is required")

    resident = _prepare_resident(form.model_dump(), form.home_id)
    try:
        result = await supabase_db.create_resident(resident)
        return {"success": True, "resident": result}
    except Exception as e:
        logger.error(f"Failed to create resident: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/upload")
async def upload_and_preview(file: UploadFile = File(...)):
    """
    Upload a PDF or image of filled intake forms.
    Returns a list of extracted resident objects for user review before committing.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    content_type = file.content_type or ""
    file_bytes = await file.read()

    if len(file_bytes) > 20 * 1024 * 1024:  # 20MB limit
        raise HTTPException(status_code=413, detail="File too large (max 20MB)")

    logger.info(f"OCR upload: {file.filename} ({len(file_bytes)} bytes, {content_type})")

    try:
        if "pdf" in content_type or file.filename.lower().endswith(".pdf"):
            residents = await ocr_service.extract_from_pdf(file_bytes)
        elif content_type.startswith("image/"):
            residents = await ocr_service.extract_from_image(file_bytes, content_type)
        else:
            raise HTTPException(
                status_code=415,
                detail="Unsupported file type. Please upload a PDF or image (JPG/PNG).",
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"OCR extraction failed: {e}")
        raise HTTPException(status_code=500, detail=f"OCR processing failed: {e}")

    if not residents:
        return {
            "success": False,
            "message": "No resident data could be extracted. Please ensure the form is filled correctly.",
            "residents": [],
        }

    return {
        "success": True,
        "count": len(residents),
        "residents": residents,
        "message": f"Successfully extracted {len(residents)} resident(s). Review and confirm below.",
    }


@router.post("/bulk-confirm")
async def bulk_confirm(req: BulkConfirmRequest):
    """
    Commit a list of pre-reviewed resident records (from OCR preview) to the database.
    """
    if not req.residents:
        raise HTTPException(status_code=400, detail="No residents provided")

    created = []
    errors = []

    for raw in req.residents:
        name = raw.get("name") or raw.get("full_name") or ""
        if not name.strip():
            errors.append({"raw": raw, "error": "Missing name — skipped"})
            continue
        try:
            resident = _prepare_resident(raw, req.home_id)
            result = await supabase_db.create_resident(resident)
            created.append(result)
        except Exception as e:
            errors.append({"name": name, "error": str(e)})

    return {
        "success": True,
        "created_count": len(created),
        "error_count": len(errors),
        "created": created,
        "errors": errors,
    }
