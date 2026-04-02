from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime, timedelta
from app.models import Booking, Vehicle, ParkingSlot, Transaction

def get_overview(db: Session) -> dict:
    total_slots   = db.query(func.count(ParkingSlot.id)).scalar()
    occupied      = db.query(func.count(ParkingSlot.id)).filter(ParkingSlot.is_occupied == True).scalar()
    today         = datetime.utcnow().date()
    today_bookings= db.query(func.count(Booking.id)).filter(func.date(Booking.created_at) == today).scalar()
    total_revenue = db.query(func.sum(Transaction.amount)).scalar() or 0

    return {
        "total_slots": total_slots,
        "occupied_slots": occupied,
        "available_slots": total_slots - occupied,
        "occupancy_rate": round(occupied / total_slots * 100, 1) if total_slots else 0,
        "today_bookings": today_bookings,
        "total_revenue": float(total_revenue),
    }

def get_vehicle_type_stats(db: Session) -> list:
    results = (
        db.query(Vehicle.vehicle_type, func.count(Booking.id).label("count"))
        .join(Booking, Booking.vehicle_id == Vehicle.id)
        .filter(Booking.status == "completed")
        .group_by(Vehicle.vehicle_type)
        .all()
    )
    return [{"vehicle_type": r.vehicle_type, "count": r.count} for r in results]

def get_hourly_traffic(db: Session) -> list:
    results = (
        db.query(
            extract("hour", Booking.in_time).label("hour"),
            func.count(Booking.id).label("count"),
        )
        .filter(Booking.in_time >= datetime.utcnow() - timedelta(days=30))
        .group_by("hour")
        .order_by("hour")
        .all()
    )
    traffic = [{"hour": int(r.hour), "count": r.count} for r in results]

    # Rule-based peak hours detection
    if traffic:
        max_count = max(t["count"] for t in traffic)
        for t in traffic:
            t["is_peak"] = t["count"] >= max_count * 0.7
    return traffic

def get_revenue_trend(db: Session, days: int = 7) -> list:
    results = (
        db.query(
            func.date(Transaction.paid_at).label("date"),
            func.sum(Transaction.amount).label("revenue"),
        )
        .filter(Transaction.paid_at >= datetime.utcnow() - timedelta(days=days))
        .group_by("date")
        .order_by("date")
        .all()
    )
    return [{"date": str(r.date), "revenue": float(r.revenue)} for r in results]

def recommend_slot_type(db: Session, vehicle_type: str) -> dict:
    """Rule-based recommendation: suggest VIP if normal slots are > 80% full."""
    total_normal = db.query(func.count(ParkingSlot.id)).filter(
        ParkingSlot.vehicle_type == vehicle_type, ParkingSlot.slot_type == "normal"
    ).scalar()
    occupied_normal = db.query(func.count(ParkingSlot.id)).filter(
        ParkingSlot.vehicle_type == vehicle_type,
        ParkingSlot.slot_type == "normal",
        ParkingSlot.is_occupied == True,
    ).scalar()
    occupancy = occupied_normal / total_normal if total_normal else 0
    recommend_vip = occupancy >= 0.8
    return {
        "vehicle_type": vehicle_type,
        "normal_occupancy_pct": round(occupancy * 100, 1),
        "recommend_vip": recommend_vip,
        "message": (
            "Normal slots are almost full — we recommend a VIP slot for guaranteed parking."
            if recommend_vip else
            "Normal slots are available. You can proceed with a normal booking."
        ),
    }
