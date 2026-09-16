import logging
import datetime
import uuid
from apscheduler.schedulers.asyncio import AsyncIOScheduler
try:
    from ..supabase_client import supabase_db
    from .twilio_service import twilio_service
except (ImportError, ValueError):
    from supabase_client import supabase_db
    from services.twilio_service import twilio_service

logger = logging.getLogger("calmie.scheduler")

scheduler = AsyncIOScheduler()

async def check_scheduled_calls():
    """
    Scans for scheduled bookings due for outbound calling and triggers them.
    """
    try:
        bookings = await supabase_db.get_bookings()
        now = datetime.datetime.now(datetime.timezone.utc)
        
        for booking in bookings:
            status = booking.get("status", "scheduled")
            if status in ("confirmed", "scheduled"):
                scheduled_str = booking.get("scheduled_at")
                if scheduled_str:
                    try:
                        scheduled_dt = datetime.datetime.fromisoformat(scheduled_str.replace("Z", "+00:00"))
                        # If due within the last 15 minutes or overdue by a little
                        if scheduled_dt <= now and (now - scheduled_dt).total_seconds() < 900:
                            resident_id = booking.get("resident_id")
                            resident = await supabase_db.get_resident_by_id(resident_id)
                            if resident:
                                logger.info(f"Triggering scheduled automated call for booking {booking.get('id')}")
                                call_id = str(uuid.uuid4())
                                to_phone = resident.get("phone", "9821400274")
                                
                                twilio_resp = await twilio_service.initiate_outbound_call(
                                    to_phone=to_phone,
                                    resident=resident,
                                    booking=booking,
                                    call_id=call_id
                                )
                                
                                now_iso = now.isoformat()
                                call_record = {
                                    "id": call_id,
                                    "booking_id": booking.get("id"),
                                    "resident_id": resident_id,
                                    "twilio_call_sid": twilio_resp.get("call_sid"),
                                    "started_at": now_iso,
                                    "status": "ringing" if twilio_resp.get("success") else "failed",
                                    "created_at": now_iso
                                }
                                await supabase_db.create_or_update_call(call_record)
                                booking["status"] = "in_progress"
                                await supabase_db.create_booking(booking)
                    except Exception as parse_err:
                        logger.debug(f"Could not parse scheduled_at '{scheduled_str}': {parse_err}")
    except Exception as e:
        logger.error(f"Scheduler check failed: {e}")

def start_scheduler():
    if not scheduler.running:
        scheduler.add_job(check_scheduled_calls, "interval", seconds=60, id="check_scheduled_calls")
        scheduler.start()
        logger.info("Calmie call scheduler started.")

def stop_scheduler():
    if scheduler.running:
        scheduler.shutdown()
        logger.info("Calmie call scheduler stopped.")
