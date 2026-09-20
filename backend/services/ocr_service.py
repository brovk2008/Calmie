import base64
import json
import logging
import io
from typing import Any, Dict, List, Optional

import httpx

try:
    from ..config import settings
except (ImportError, ValueError):
    from config import settings

logger = logging.getLogger("calmie.ocr")

# Field labels we expect in the resident intake form
RESIDENT_FIELDS = [
    "Full Name", "Age", "Room Number", "Phone", "Hometown",
    "Languages", "Hobbies", "Favorite Topics", "Avoid Topics",
    "Health Notes", "Family Notes", "Personality", "Emergency Contact",
]

CLAUDE_OCR_SYSTEM = (
    "You are a data extraction specialist. You are given text from a filled-in resident intake form "
    "for senior citizens in an old age home. Extract the data into a JSON array. "
    "Each element of the array should be one resident with the following keys (use null if not found):\n"
    "  full_name, age, room_number, phone, hometown, languages, hobbies, "
    "favorite_topics, avoid_topics, health_notes, family_notes, personality, emergency_contact\n\n"
    "If the document contains multiple residents (e.g., multiple form pages), return an array with one object per resident. "
    "Respond ONLY with valid JSON — no markdown, no explanation."
)

CLAUDE_VISION_SYSTEM = (
    "You are an OCR and data extraction specialist. You are given an image of a filled-in resident intake form "
    "for senior citizens in an old age home. Read all handwritten and printed text carefully. "
    "Extract all resident data into a JSON array. "
    "Each element should be one resident with these keys (use null if not found):\n"
    "  full_name, age, room_number, phone, hometown, languages, hobbies, "
    "favorite_topics, avoid_topics, health_notes, family_notes, personality, emergency_contact\n\n"
    "If the form has multiple pages or residents, return all of them in the array. "
    "Respond ONLY with valid JSON — no markdown, no explanation."
)


class OCRService:
    def __init__(self):
        self.api_key = getattr(settings, "ANTHROPIC_API_KEY", "")

    def _is_configured(self) -> bool:
        return bool(self.api_key and len(self.api_key) > 10)

    async def _call_claude_text(self, text: str) -> List[Dict[str, Any]]:
        """Send extracted PDF text to Claude Haiku for structured parsing."""
        models = ["claude-3-5-haiku-20241022", "claude-3-haiku-20240307"]
        async with httpx.AsyncClient(timeout=30.0) as client:
            for model in models:
                try:
                    resp = await client.post(
                        "https://api.anthropic.com/v1/messages",
                        headers={
                            "x-api-key": self.api_key,
                            "anthropic-version": "2023-06-01",
                            "content-type": "application/json",
                        },
                        json={
                            "model": model,
                            "max_tokens": 2048,
                            "system": CLAUDE_OCR_SYSTEM,
                            "messages": [{"role": "user", "content": f"Form text:\n\n{text}"}],
                        },
                    )
                    if resp.status_code == 200:
                        raw = resp.json()["content"][0]["text"].strip()
                        return self._parse_json_response(raw)
                except Exception as e:
                    logger.warning(f"Claude text OCR failed with {model}: {e}")
        return []

    async def _call_claude_vision(self, image_bytes: bytes, media_type: str = "image/png") -> List[Dict[str, Any]]:
        """Send image to Claude Sonnet Vision for OCR + structured parsing."""
        b64 = base64.standard_b64encode(image_bytes).decode("utf-8")
        models = ["claude-3-5-sonnet-20241022", "claude-3-sonnet-20240229"]
        async with httpx.AsyncClient(timeout=60.0) as client:
            for model in models:
                try:
                    resp = await client.post(
                        "https://api.anthropic.com/v1/messages",
                        headers={
                            "x-api-key": self.api_key,
                            "anthropic-version": "2023-06-01",
                            "content-type": "application/json",
                        },
                        json={
                            "model": model,
                            "max_tokens": 4096,
                            "system": CLAUDE_VISION_SYSTEM,
                            "messages": [
                                {
                                    "role": "user",
                                    "content": [
                                        {
                                            "type": "image",
                                            "source": {
                                                "type": "base64",
                                                "media_type": media_type,
                                                "data": b64,
                                            },
                                        },
                                        {"type": "text", "text": "Please extract all resident data from this form image."},
                                    ],
                                }
                            ],
                        },
                    )
                    if resp.status_code == 200:
                        raw = resp.json()["content"][0]["text"].strip()
                        return self._parse_json_response(raw)
                    else:
                        logger.warning(f"Claude Vision {model} returned {resp.status_code}: {resp.text[:200]}")
                except Exception as e:
                    logger.warning(f"Claude Vision failed with {model}: {e}")
        return []

    def _parse_json_response(self, raw: str) -> List[Dict[str, Any]]:
        """Clean and parse Claude's JSON response into a list of resident dicts."""
        try:
            # Strip markdown fences
            if "```json" in raw:
                raw = raw.split("```json")[1].split("```")[0].strip()
            elif "```" in raw:
                raw = raw.split("```")[1].split("```")[0].strip()
            parsed = json.loads(raw)
            if isinstance(parsed, dict):
                return [parsed]
            if isinstance(parsed, list):
                return parsed
        except Exception as e:
            logger.warning(f"Failed to parse Claude JSON response: {e}\nRaw: {raw[:300]}")
        return []

    def _extract_pdf_text(self, pdf_bytes: bytes) -> Optional[str]:
        """Extract text from a digital (non-scanned) PDF using pdfplumber."""
        try:
            import pdfplumber
            with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
                pages_text = []
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        pages_text.append(text)
                return "\n\n--- PAGE BREAK ---\n\n".join(pages_text) if pages_text else None
        except Exception as e:
            logger.warning(f"pdfplumber extraction failed: {e}")
            return None

    def _pdf_to_images(self, pdf_bytes: bytes) -> List[bytes]:
        """Convert PDF pages to PNG images for Claude Vision."""
        try:
            import fitz  # PyMuPDF
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            images = []
            for page in doc:
                mat = fitz.Matrix(2.0, 2.0)  # 2x zoom for better OCR quality
                pix = page.get_pixmap(matrix=mat)
                images.append(pix.tobytes("png"))
            doc.close()
            return images
        except Exception as e:
            logger.warning(f"PDF-to-image conversion failed: {e}")
            return []

    def _normalize_resident(self, raw: Dict[str, Any]) -> Dict[str, Any]:
        """Normalize Claude-extracted fields to our DB schema."""
        # Handle age — ensure integer
        age = raw.get("age")
        if age is not None:
            try:
                age = int(str(age).strip())
            except Exception:
                age = None

        return {
            "name": raw.get("full_name") or raw.get("name") or "",
            "age": age,
            "room_number": str(raw.get("room_number") or "").strip() or None,
            "phone": str(raw.get("phone") or "").strip() or None,
            "hometown": raw.get("hometown") or None,
            "preferred_lang": raw.get("languages") or None,
            "hobbies": raw.get("hobbies") or None,
            "favorite_topics": raw.get("favorite_topics") or None,
            "avoid_topics": raw.get("avoid_topics") or None,
            "health_notes": raw.get("health_notes") or None,
            "family_notes": raw.get("family_notes") or None,
            "personality": raw.get("personality") or None,
            "emergency_contact": raw.get("emergency_contact") or None,
            "active": True,
        }

    async def extract_from_pdf(self, pdf_bytes: bytes) -> List[Dict[str, Any]]:
        """Main entry point: extract resident data from a PDF (digital or scanned)."""
        if not self._is_configured():
            logger.warning("Anthropic API key not set — OCR unavailable")
            return []

        # Step 1: Try digital PDF text extraction
        text = self._extract_pdf_text(pdf_bytes)
        if text and len(text.strip()) > 50:
            logger.info("PDF has selectable text — using Claude text OCR")
            raw_list = await self._call_claude_text(text)
            if raw_list:
                return [self._normalize_resident(r) for r in raw_list if r.get("full_name") or r.get("name")]

        # Step 2: Fallback — convert to images + Claude Vision
        logger.info("PDF appears to be scanned — using Claude Vision OCR")
        images = self._pdf_to_images(pdf_bytes)
        if not images:
            logger.error("Could not convert PDF to images")
            return []

        all_residents = []
        for i, img_bytes in enumerate(images):
            logger.info(f"Running Vision OCR on page {i+1}")
            page_residents = await self._call_claude_vision(img_bytes, "image/png")
            all_residents.extend(page_residents)

        return [self._normalize_resident(r) for r in all_residents if r.get("full_name") or r.get("name")]

    async def extract_from_image(self, image_bytes: bytes, mime_type: str) -> List[Dict[str, Any]]:
        """Extract resident data from a raw image (JPG/PNG)."""
        if not self._is_configured():
            return []
        raw_list = await self._call_claude_vision(image_bytes, mime_type)
        return [self._normalize_resident(r) for r in raw_list if r.get("full_name") or r.get("name")]


ocr_service = OCRService()
