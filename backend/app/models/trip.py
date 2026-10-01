from sqlalchemy import Column, Integer, String, DateTime, Float, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.postgresql import Base

class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    destination = Column(String(255), nullable=False)
    start_date = Column(DateTime(timezone=True), nullable=False)
    travelers = Column(Integer, nullable=False)
    budget = Column(Float, nullable=False)
    preferences = Column(Text, nullable=True)
    status = Column(String(50), default="pending")
    trip_data_id = Column(String(255), unique=True, nullable=True)
    total_cost = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", backref="trips")

    def __repr__(self):
        return f"<Trip(id={self.id}, destination={self.destination}, status={self.status})>"