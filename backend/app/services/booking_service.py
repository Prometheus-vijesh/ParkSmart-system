from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException
from datetime import datetime, timedelta
from app.models import Booking, ParkingSlot, Pricing, Coupon, Vehicle, Transaction
from app.schemas.booking import BookingCreate

# Store times in IST (UTC+5:30) so frontend can display directly without conversion
def now_ist():
    return datetime.utcnow() + timedelta(hours=5, minutes=30)

def create_booking(db: Session, user_id: int, payload: BookingCreate) -> Booking:
    vehicle = db.query(Vehicle).filter(Vehicle.id == payload.vehicle_id, Vehicle.user_id == user_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found or not yours")

    # Check no active booking for this vehicle
    active = db.query(Booking).filter(Booking.vehicle_id == vehicle.id, Booking.status == "active").first()
    if active:
        raise HTTPException(status_code=400, detail="Vehicle already has an active booking")

    # Find a free slot
    slot = (
        db.query(ParkingSlot)
        .filter(
            ParkingSlot.vehicle_type == vehicle.vehicle_type,
            ParkingSlot.slot_type == payload.slot_type,
            ParkingSlot.is_occupied == False,
        )
        .with_for_update()
        .first()
    )
    if not slot:
        raise HTTPException(status_code=400, detail=f"No available {payload.slot_type} slots for {vehicle.vehicle_type}")

    coupon_id = None
    if payload.coupon_code:
        coupon = db.query(Coupon).filter(
            Coupon.code == payload.coupon_code.upper(),
            Coupon.is_active == True,
        ).first()
        if not coupon:
            raise HTTPException(status_code=400, detail="Invalid or expired coupon")
        if coupon.expires_at and coupon.expires_at < datetime.utcnow():
            raise HTTPException(status_code=400, detail="Coupon has expired")
        if coupon.times_used >= coupon.usage_limit:
            raise HTTPException(status_code=400, detail="Coupon usage limit reached")
        coupon.times_used += 1
        coupon_id = coupon.id

    slot.is_occupied = True
    booking = Booking(
        vehicle_id=vehicle.id,
        slot_id=slot.id,
        user_id=user_id,
        coupon_id=coupon_id,
        status="active",
        in_time=now_ist(),
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking

def checkout_booking(db: Session, booking_id: int, user_id: int, payment_method: str) -> Booking:
    booking = db.query(Booking).filter(
        Booking.id == booking_id,
        Booking.user_id == user_id,
        Booking.status == "active",
    ).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Active booking not found")

    out_time = now_ist()
    delta = out_time - booking.in_time
    hours = max(delta.total_seconds() / 3600, 0.5)  # Minimum 30 minutes

    pricing = db.query(Pricing).filter(Pricing.vehicle_type == booking.vehicle.vehicle_type).first()
    rate = float(pricing.rate_per_hour) if pricing else {"car": 50, "bike": 20, "bicycle": 10, "ev": 80}.get(booking.vehicle.vehicle_type, 50)
    vip_surcharge = float(pricing.vip_surcharge) if pricing else (rate * 0.5)

    if booking.slot.slot_type == "vip":
        rate += vip_surcharge
    base_amount = round(hours * rate, 2)

    discount = 0.0
    if booking.coupon_id:
        coupon = db.query(Coupon).filter(Coupon.id == booking.coupon_id).first()
        if coupon:
            discount = float(coupon.discount_flat) + (base_amount * float(coupon.discount_pct) / 100)
            discount = min(discount, base_amount)

    total = round(base_amount - discount, 2)

    booking.out_time = out_time
    booking.duration_hours = round(hours, 2)
    booking.base_amount = base_amount
    booking.discount_amount = round(discount, 2)
    booking.total_amount = total
    booking.status = "completed"
    booking.slot.is_occupied = False

    txn = Transaction(booking_id=booking.id, amount=total, payment_method=payment_method)
    db.add(txn)
    db.commit()
    db.refresh(booking)
    return booking
