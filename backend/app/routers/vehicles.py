from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Vehicle, Booking
from app.schemas.vehicle import VehicleCreate, VehicleOut
from app.utils.security import get_current_user
from typing import List

router = APIRouter(prefix="/api/vehicles", tags=["Vehicles"])

@router.post("", response_model=VehicleOut, status_code=201)
def add_vehicle(payload: VehicleCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    existing = db.query(Vehicle).filter(Vehicle.plate_number == payload.plate_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Plate number already registered")
    v = Vehicle(
        user_id=current_user.id,
        plate_number=payload.plate_number.upper(),
        vehicle_type=payload.vehicle_type,
        vehicle_name=payload.vehicle_name,
    )
    db.add(v)
    db.commit()
    db.refresh(v)
    return v

@router.get("", response_model=List[VehicleOut])
def my_vehicles(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(Vehicle).filter(Vehicle.user_id == current_user.id).all()

@router.delete("/{vehicle_id}", status_code=204)
def delete_vehicle(vehicle_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    v = db.query(Vehicle).filter(Vehicle.id == vehicle_id, Vehicle.user_id == current_user.id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    # Prevent deletion if vehicle has an active booking
    active = db.query(Booking).filter(Booking.vehicle_id == vehicle_id, Booking.status == "active").first()
    if active:
        raise HTTPException(status_code=400, detail="Cannot remove vehicle with an active booking. Please checkout first.")
    
    try:
        db.delete(v)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Cannot remove vehicle with existing booking history.")
