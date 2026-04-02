from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

class VehicleType(str, enum.Enum):
    car     = "car"
    bike    = "bike"
    bicycle = "bicycle"
    ev      = "ev"

class Vehicle(Base):
    __tablename__ = "vehicles"

    id           = Column(Integer, primary_key=True, index=True)
    user_id      = Column(Integer, ForeignKey("users.id"), nullable=False)
    plate_number = Column(String(20), unique=True, nullable=False, index=True)
    vehicle_type = Column(Enum(VehicleType), nullable=False)
    vehicle_name = Column(String(100), nullable=False)
    created_at   = Column(DateTime, server_default=func.now())

    owner    = relationship("User", back_populates="vehicles")
    bookings = relationship("Booking", back_populates="vehicle")
