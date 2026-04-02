from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, SmallInteger
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

class SlotType(str, enum.Enum):
    normal = "normal"
    vip    = "vip"

class ParkingSlot(Base):
    __tablename__ = "parking_slots"

    id           = Column(Integer, primary_key=True, index=True)
    slot_code    = Column(String(10), unique=True, nullable=False, index=True)
    vehicle_type = Column(String(20), nullable=False)
    slot_type    = Column(Enum(SlotType), nullable=False, default=SlotType.normal)
    is_occupied  = Column(Boolean, default=False)
    floor        = Column(SmallInteger, default=1)
    created_at   = Column(DateTime, server_default=func.now())

    bookings = relationship("Booking", back_populates="slot")
