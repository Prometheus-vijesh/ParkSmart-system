from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.utils.security import require_admin, get_current_user
from app.services.analytics_service import (
    get_overview, get_vehicle_type_stats,
    get_hourly_traffic, get_revenue_trend, recommend_slot_type
)

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("/overview")
def overview(db: Session = Depends(get_db), _=Depends(require_admin)):
    return get_overview(db)

@router.get("/vehicle-stats")
def vehicle_stats(db: Session = Depends(get_db), _=Depends(require_admin)):
    return get_vehicle_type_stats(db)

@router.get("/hourly-traffic")
def hourly_traffic(db: Session = Depends(get_db), _=Depends(require_admin)):
    return get_hourly_traffic(db)

@router.get("/revenue-trend")
def revenue_trend(days: int = Query(7, le=30), db: Session = Depends(get_db), _=Depends(require_admin)):
    return get_revenue_trend(db, days)

@router.get("/recommend")
def recommend(vehicle_type: str = Query(...), db: Session = Depends(get_db), _=Depends(get_current_user)):
    return recommend_slot_type(db, vehicle_type)
