from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime
import re

VEHICLE_TYPES = {"car", "bike", "bicycle", "ev"}

class VehicleCreate(BaseModel):
    plate_number: str
    vehicle_type: str
    vehicle_name: str

    @field_validator("plate_number")
    @classmethod
    def validate_plate(cls, v):
        v = v.upper().strip()
        if not re.match(r"^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$", v):
            raise ValueError("Invalid plate number format (e.g. TN01AB1234)")
        return v

    @field_validator("vehicle_type")
    @classmethod
    def validate_type(cls, v):
        if v.lower() not in VEHICLE_TYPES:
            raise ValueError(f"Vehicle type must be one of: {VEHICLE_TYPES}")
        return v.lower()

class VehicleOut(BaseModel):
    id: int
    plate_number: str
    vehicle_type: str
    vehicle_name: str
    created_at: datetime

    class Config:
        from_attributes = True
