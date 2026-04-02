from sqlalchemy import Column, Integer, ForeignKey, DateTime, Numeric, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Booking(Base):
    __tablename__ = "bookings"

    id              = Column(Integer, primary_key=True, index=True)
    vehicle_id      = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    slot_id         = Column(Integer, ForeignKey("parking_slots.id"), nullable=False)
    user_id         = Column(Integer, ForeignKey("users.id"), nullable=False)
    coupon_id       = Column(Integer, ForeignKey("coupons.id"), nullable=True)
    status          = Column(Enum("active","completed","cancelled"), default="active")
    in_time         = Column(DateTime, server_default=func.now())
    out_time        = Column(DateTime, nullable=True)
    duration_hours  = Column(Numeric(8, 2), nullable=True)
    base_amount     = Column(Numeric(10, 2), nullable=True)
    discount_amount = Column(Numeric(10, 2), default=0)
    total_amount    = Column(Numeric(10, 2), nullable=True)
    created_at      = Column(DateTime, server_default=func.now())

    vehicle  = relationship("Vehicle", back_populates="bookings")
    slot     = relationship("ParkingSlot", back_populates="bookings")
    user     = relationship("User", back_populates="bookings")
    coupon   = relationship("Coupon", back_populates="bookings")
    transaction = relationship("Transaction", back_populates="booking", uselist=False)
