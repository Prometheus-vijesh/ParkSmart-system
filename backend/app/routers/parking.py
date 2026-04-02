from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import ParkingSlot, Pricing
from app.utils.security import get_current_user
from typing import List

router = APIRouter(prefix="/api/parking", tags=["Parking"])

@router.get("/slots/summary")
def slot_summary(db: Session = Depends(get_db)):
    rows = (
        db.query(
            ParkingSlot.vehicle_type,
            ParkingSlot.slot_type,
            func.count(ParkingSlot.id).label("total"),
            func.sum(
                func.IF(ParkingSlot.is_occupied == False, 1, 0)
            ).label("available"),
        )
        .group_by(ParkingSlot.vehicle_type, ParkingSlot.slot_type)
        .all()
    )
    return [
        {
            "vehicle_type": r.vehicle_type,
            "slot_type": r.slot_type,
            "total": r.total,
            "available": int(r.available or 0),
            "occupied": r.total - int(r.available or 0),
        }
        for r in rows
    ]

@router.get("/slots")
def list_slots(
    vehicle_type: str = Query(None),
    slot_type: str = Query(None),
    is_occupied: bool = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(ParkingSlot)
    if vehicle_type:
        q = q.filter(ParkingSlot.vehicle_type == vehicle_type)
    if slot_type:
        q = q.filter(ParkingSlot.slot_type == slot_type)
    if is_occupied is not None:
        q = q.filter(ParkingSlot.is_occupied == is_occupied)
    return q.order_by(ParkingSlot.slot_code).limit(200).all()

@router.get("/pricing")
def pricing(db: Session = Depends(get_db)):
    return db.query(Pricing).all()
