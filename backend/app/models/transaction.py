from sqlalchemy import Column, Integer, ForeignKey, Numeric, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id             = Column(Integer, primary_key=True, index=True)
    booking_id     = Column(Integer, ForeignKey("bookings.id"), unique=True, nullable=False)
    amount         = Column(Numeric(10, 2), nullable=False)
    payment_method = Column(Enum("cash","card","upi"), default="cash")
    status         = Column(Enum("pending","success","failed"), default="success")
    paid_at        = Column(DateTime, server_default=func.now())

    booking = relationship("Booking", back_populates="transaction")
