from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, get_db, Base
from .models import Measurement
from .schemas import MeasurementCreate, MeasurementResponse

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="IoT Temperature & Humidity API",
    description="REST API for receiving and storing temperature/humidity measurements",
    version="1.0.0",
)

# Enable CORS for web UI access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    """Health check and API info endpoint."""
    return {
        "status": "healthy",
        "api": "IoT Temperature & Humidity API",
        "version": "1.0.0",
    }


@app.post(
    "/measurements",
    response_model=MeasurementResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_measurement(
    measurement: MeasurementCreate, db: Session = Depends(get_db)
):
    """Submit a new temperature and humidity measurement."""
    db_measurement = Measurement(
        device_id=measurement.device_id,
        temperature=measurement.temperature,
        humidity=measurement.humidity,
    )
    db.add(db_measurement)
    db.commit()
    db.refresh(db_measurement)
    return db_measurement


@app.get("/measurements", response_model=list[MeasurementResponse])
def list_measurements(device_id: str | None = None, db: Session = Depends(get_db)):
    """List all measurements with optional device_id filter."""
    query = db.query(Measurement)
    if device_id:
        query = query.filter(Measurement.device_id == device_id)
    return query.order_by(Measurement.timestamp.desc()).all()


@app.get("/measurements/{measurement_id}", response_model=MeasurementResponse)
def get_measurement(measurement_id: int, db: Session = Depends(get_db)):
    """Get a specific measurement by ID."""
    measurement = db.query(Measurement).filter(Measurement.id == measurement_id).first()
    if measurement is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Measurement with id {measurement_id} not found",
        )
    return measurement
