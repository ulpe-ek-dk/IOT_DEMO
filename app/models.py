from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, Float

from .database import Base


def get_utc_timestamp():
    """
    Lav UTC tidsstempel som ISO streng med Z suffix
    """    
    return datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%fZ')

class Measurement(Base):
    __tablename__ = "measurements"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String, index=True, nullable=False)
    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    timestamp = Column(String, default=get_utc_timestamp, nullable=False)