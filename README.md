# IoT Temperature & Humidity API

A REST API backend for receiving and storing temperature/humidity measurements from IoT sensors.

## Project Structure

```
IOT_DEMO/
├── README.md
├── requirements.txt      # Python dependencies
├── measurements.db       # SQLite database (created at runtime)
└── app/
    ├── __init__.py
    ├── main.py           # FastAPI application and endpoints
    ├── database.py       # SQLite connection and session setup
    ├── models.py         # SQLAlchemy ORM model (Measurement)
    └── schemas.py        # Pydantic validation schemas
```

### File Descriptions

| File | Description |
|------|-------------|
| `requirements.txt` | Lists dependencies: FastAPI, Uvicorn, SQLAlchemy, Pydantic |
| `app/main.py` | Defines API endpoints and FastAPI app configuration |
| `app/database.py` | Configures SQLite database engine and session handling |
| `app/models.py` | Defines the `Measurement` database table structure |
| `app/schemas.py` | Defines request/response data validation schemas |

# Virtual Python environment
python3 -m venv venv
source venv/bin/activate

## Installation

```bash
pip install -r requirements.txt
```

## Starting the API

```bash
python -m uvicorn app.main:app --reload
```
#Kører kun lokalt, kan ikke ses fra Raspberry Pi
The server will start at http://127.0.0.1:8000

- `--reload` enables auto-reload on code changes (development mode)
- Remove `--reload` for production

### Alternative start commands

```bash
# Specify host and port
python -m uvicorn app.main:app --host 0.0.0.0 --port 8080

# Production mode (no reload)
python -m uvicorn app.main:app
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/measurements` | Submit a new measurement |
| GET | `/measurements` | List all measurements |
| GET | `/measurements?device_id=X` | Filter by device ID |
| GET | `/measurements/{id}` | Get measurement by ID |

## Testing the API

### Interactive Documentation

Open http://127.0.0.1:8000/docs for Swagger UI where you can test all endpoints interactively.

### Using curl

**Submit a measurement:**
```bash
curl -X POST http://127.0.0.1:8000/measurements \
  -H "Content-Type: application/json" \
  -d '{"device_id": "sensor-01", "temperature": 23.5, "humidity": 65.2}'
```

**Get all measurements:**
```bash
curl http://127.0.0.1:8000/measurements
```

**Filter by device:**
```bash
curl "http://127.0.0.1:8000/measurements?device_id=sensor-01"
```

**Get single measurement:**
```bash
curl http://127.0.0.1:8000/measurements/1
```

**Health check:**
```bash
curl http://127.0.0.1:8000/
```

### Example Response

```json
{
  "id": 1,
  "device_id": "sensor-01",
  "temperature": 23.5,
  "humidity": 65.2,
  "timestamp": "2026-01-22T10:30:00.123456"
}
```

## Stopping the API

Press `Ctrl+C` in the terminal where the server is running.

## Database

The SQLite database (`measurements.db`) is created automatically on first run. To reset the database, simply delete the file:

```bash
rm measurements.db
```
