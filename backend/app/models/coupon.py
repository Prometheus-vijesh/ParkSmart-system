from sqlalchemy import Column, Integer, String, Boolean, DateTime, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Coupon(Base):
    __tablename__ = "coupons"

    id            = Column(Integer, primary_key=True, index=True)
    code          = Column(String(20), unique=True, nullable=False, index=True)
    discount_flat = Column(Numeric(8, 2), default=0)
    discount_pct  = Column(Numeric(5, 2), default=0)
    is_active     = Column(Boolean, default=True)
    usage_limit   = Column(Integer, default=1)
    times_used    = Column(Integer, default=0)
    expires_at    = Column(DateTime, nullable=True)
    created_at    = Column(DateTime, server_default=func.now())

    bookings = relationship("Booking", back_populates="coupon")
