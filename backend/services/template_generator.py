"""
Template PDF generator for Calmie Resident Intake Form.
Uses reportlab — pure Python, no binary dependencies, works on Vercel.
"""
import io
import logging
from typing import Optional

logger = logging.getLogger("calmie.template")


def generate_intake_template() -> bytes:
    """
    Generate the Calmie Resident Intake Form PDF.
    Returns raw PDF bytes ready to serve as a download.
    """
    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.units import cm
        from reportlab.lib import colors
        from reportlab.platypus import (
            SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
        )
        from reportlab.lib.enums import TA_CENTER, TA_LEFT

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=2 * cm,
            leftMargin=2 * cm,
            topMargin=2 * cm,
            bottomMargin=2 * cm,
        )

        styles = getSampleStyleSheet()

        # Custom styles
        title_style = ParagraphStyle(
            "CalmieTitle",
            parent=styles["Heading1"],
            fontSize=20,
            textColor=colors.HexColor("#1a1a2e"),
            alignment=TA_CENTER,
            spaceAfter=4,
            fontName="Helvetica-Bold",
        )
        subtitle_style = ParagraphStyle(
            "CalmieSubtitle",
            parent=styles["Normal"],
            fontSize=10,
            textColor=colors.HexColor("#555555"),
            alignment=TA_CENTER,
            spaceAfter=2,
        )
        section_style = ParagraphStyle(
            "Section",
            parent=styles["Heading2"],
            fontSize=11,
            textColor=colors.HexColor("#1a1a2e"),
            fontName="Helvetica-Bold",
            spaceBefore=14,
            spaceAfter=6,
            borderPad=4,
        )
        label_style = ParagraphStyle(
            "Label",
            parent=styles["Normal"],
            fontSize=9,
            textColor=colors.HexColor("#333333"),
            fontName="Helvetica-Bold",
            spaceAfter=2,
        )
        note_style = ParagraphStyle(
            "Note",
            parent=styles["Normal"],
            fontSize=8,
            textColor=colors.HexColor("#777777"),
            alignment=TA_CENTER,
        )

        # Helper: field row (label + underline for handwriting)
        def field_row(label: str, lines: int = 1, hint: str = "") -> list:
            items = []
            hint_text = f" <font color='#aaaaaa' size='8'>({hint})</font>" if hint else ""
            items.append(Paragraph(f"{label}{hint_text}", label_style))
            for _ in range(lines):
                items.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#cccccc"), spaceAfter=6))
            items.append(Spacer(1, 4))
            return items

        story = []

        # ── HEADER ──────────────────────────────────────────────────────────
        story.append(Paragraph("🌻 CALMIE", title_style))
        story.append(Paragraph("Resident Intake Form", subtitle_style))
        story.append(Paragraph(
            "Fill one form per resident. Submit to your care home admin or upload directly at calmie-lol.vercel.app/intake",
            note_style,
        ))
        story.append(Spacer(1, 0.4 * cm))
        story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor("#FFD93D"), spaceAfter=12))

        # ── SECTION 1: Basic Info ────────────────────────────────────────────
        story.append(Paragraph("SECTION 1 — Basic Information", section_style))
        story.extend(field_row("Full Name *", hint="As on Aadhaar"))
        story.extend(field_row("Age *", hint="Years"))
        story.extend(field_row("Room Number", hint="e.g., 104"))
        story.extend(field_row("Phone Number *", hint="10-digit mobile number"))
        story.extend(field_row("Home / Facility Name *", hint="Name of the old age home"))
        story.extend(field_row("Emergency Contact Name & Phone", hint="Family member who should be notified"))

        # ── SECTION 2: Life Story ────────────────────────────────────────────
        story.append(Paragraph("SECTION 2 — Life Story & Personality", section_style))
        story.extend(field_row("Hometown / City of Origin", hint="Where they grew up"))
        story.extend(field_row("Languages Spoken", hint="e.g., Hindi, English, Punjabi"))
        story.extend(field_row("Former Occupation / Profession"))
        story.extend(field_row("Hobbies & Interests", lines=2, hint="e.g., cricket, bhajan singing, chess"))
        story.extend(field_row("Favorite Topics to Discuss", lines=2, hint="Stories they love to tell"))
        story.extend(field_row("Topics to Avoid", hint="e.g., deceased spouse, estranged family"))
        story.extend(field_row("Personality Description", lines=2, hint="Calm? Talkative? Formal? Jokes?"))

        # ── SECTION 3: Health & Family ───────────────────────────────────────
        story.append(Paragraph("SECTION 3 — Health & Family Notes", section_style))
        story.extend(field_row("Health Notes", lines=2, hint="Hearing, memory, mobility, conditions AI should know"))
        story.extend(field_row("Family Notes", lines=2, hint="Who visits, who calls, family dynamics"))

        # ── SECTION 4: Photo spot ────────────────────────────────────────────
        story.append(Paragraph("SECTION 4 — Photo (Optional)", section_style))
        # Photo box
        photo_table = Table(
            [["Paste or attach a\nclear photo of the\nresident here"]],
            colWidths=[5 * cm],
            rowHeights=[5 * cm],
        )
        photo_table.setStyle(TableStyle([
            ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#cccccc")),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("TEXTCOLOR", (0, 0), (-1, -1), colors.HexColor("#aaaaaa")),
            ("FONTSIZE", (0, 0), (-1, -1), 9),
        ]))
        story.append(photo_table)
        story.append(Spacer(1, 0.4 * cm))

        # ── FOOTER ───────────────────────────────────────────────────────────
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#eeeeee"), spaceBefore=16))
        story.append(Paragraph(
            "Calmie — The world forgot to call. We didn't.  |  calmie-lol.vercel.app",
            note_style,
        ))
        story.append(Paragraph(
            "* Required fields.  Upload completed forms at /intake/upload  |  Fill in digitally or print and scan.",
            note_style,
        ))

        doc.build(story)
        buffer.seek(0)
        return buffer.read()

    except ImportError as e:
        logger.error(f"reportlab not installed: {e}")
        raise RuntimeError("PDF generation requires reportlab. Install with: pip install reportlab") from e
