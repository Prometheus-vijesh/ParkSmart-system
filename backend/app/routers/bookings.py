from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.booking import BookingCreate, CheckoutRequest, BookingOut
from app.services.booking_service import create_booking, checkout_booking
from app.utils.security import get_current_user
from app.models import Booking

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])

@router.post("", response_model=BookingOut, status_code=201)
def book(payload: BookingCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return create_booking(db, current_user.id, payload)

@router.post("/checkout", response_model=BookingOut)
def checkout(payload: CheckoutRequest, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return checkout_booking(db, payload.booking_id, current_user.id, payload.payment_method)

@router.get("/my", response_model=List[BookingOut])
def my_bookings(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return (
        db.query(Booking)
        .filter(Booking.user_id == current_user.id)
        .order_by(Booking.created_at.desc())
        .limit(50)
        .all()
    )

@router.get("/active", response_model=BookingOut)
def my_active_booking(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    from fastapi import HTTPException
    b = db.query(Booking).filter(Booking.user_id == current_user.id, Booking.status == "active").first()
    if not b:
        raise HTTPException(status_code=404, detail="No active booking")
    return b

@router.get("/{booking_id}", response_model=BookingOut)
def get_booking(booking_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    from fastapi import HTTPException
    b = db.query(Booking).filter(Booking.id == booking_id, Booking.user_id == current_user.id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")
    return b
