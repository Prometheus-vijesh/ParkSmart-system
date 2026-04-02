from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

class UserRole(str, enum.Enum):
    admin = "admin"
    driver = "driver"

class User(Base):
    __tablename__ = "users"

    id            = Column(Integer, primary_key=True, index=True)
    full_name     = Column(String(100), nullable=False)
    email         = Column(String(150), unique=True, nullable=False, index=True)
    phone         = Column(String(15))
    password_hash = Column(String(255), nullable=False)
    role          = Column(Enum(UserRole), nullable=False, default=UserRole.driver)
    is_active     = Column(Boolean, default=True)
    created_at    = Column(DateTime, server_default=func.now())
    updated_at    = Column(DateTime, server_default=func.now(), onupdate=func.now())

    vehicles = relationship("Vehicle", back_populates="owner", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="user")
