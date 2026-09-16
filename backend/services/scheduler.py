import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from ..supabase_client import supabase_db

logger = logging.getLogger("calmie.scheduler")

scheduler = AsyncIOScheduler()

async def check_scheduled_calls():
    """
    Scans for scheduled bookings due for outbound calling.
    """
    try:
        # In a production setup, query bookings where status = 'scheduled' and scheduled_at <= now
        pass
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
