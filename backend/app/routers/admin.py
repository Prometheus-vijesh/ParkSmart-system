from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.utils.security import require_admin
from app.models import Booking, User, Vehicle
from app.schemas.booking import PricingUpdate
from app.services.parking_service import update_pricing

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.get("/bookings")
def all_bookings(db: Session = Depends(get_db), _=Depends(require_admin)):
    return (
        db.query(Booking)
        .order_by(Booking.created_at.desc())
        .limit(100)
        .all()
    )

@router.get("/users")
def all_users(db: Session = Depends(get_db), _=Depends(require_admin)):
    return db.query(User).all()

@router.put("/pricing")
def edit_pricing(payload: PricingUpdate, db: Session = Depends(get_db), _=Depends(require_admin)):
    return update_pricing(db, payload.vehicle_type, payload.rate_per_hour, payload.vip_surcharge)

@router.patch("/users/{user_id}/deactivate")
def deactivate_user(user_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    from fastapi import HTTPException
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    user.is_active = False
    db.commit()
    return {"detail": "User deactivated"}
