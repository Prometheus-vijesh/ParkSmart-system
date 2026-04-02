from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BookingCreate(BaseModel):
    vehicle_id: int
    slot_type: str = "normal"   # normal | vip
    coupon_code: Optional[str] = None
    payment_method: str = "cash"

class CheckoutRequest(BaseModel):
    booking_id: int
    payment_method: str = "cash"

class BookingOut(BaseModel):
    id: int
    vehicle_id: int
    slot_id: int
    status: str
    in_time: datetime
    out_time: Optional[datetime]
    duration_hours: Optional[float]
    base_amount: Optional[float]
    discount_amount: float
    total_amount: Optional[float]
    created_at: datetime

    class Config:
        from_attributes = True

class PricingUpdate(BaseModel):
    vehicle_type: str
    rate_per_hour: float
    vip_surcharge: float
