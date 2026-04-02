from sqlalchemy import Column, Integer, Numeric, DateTime, Enum
from sqlalchemy.sql import func
from app.database import Base

class Pricing(Base):
    __tablename__ = "pricing"

    id            = Column(Integer, primary_key=True, index=True)
    vehicle_type  = Column(Enum("car","bike","bicycle","ev"), unique=True, nullable=False)
    rate_per_hour = Column(Numeric(8, 2), nullable=False)
    vip_surcharge = Column(Numeric(8, 2), default=0)
    updated_at    = Column(DateTime, server_default=func.now(), onupdate=func.now())
