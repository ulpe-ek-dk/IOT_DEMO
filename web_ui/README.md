# IoT Monitor Web UI

A browser-based dashboard for viewing temperature and humidity measurements from the IoT API.

## Features

- Real-time measurement display
- Auto-refresh every 10 seconds
- Filter by device ID
- Latest readings cards for each device
- Measurement history table
- Responsive design for mobile and desktop

## Files

```
web_ui/
├── index.html    # Main HTML page
├── style.css     # Styling
├── script.js     # API calls and UI logic
└── README.md     # This file
```

## How to Run

### Option 1: Python HTTP Server (Recommended)

Open a terminal in the `web_ui` folder and run:

```bash
# Python 3
python -m http.server 8001

# Or specify a different port
python -m http.server 3000
```

Then open your browser to: http://localhost:8001

### Option 2: Open Directly (Limited)

You can open `index.html` directly in a browser, but you may encounter CORS issues when connecting to the API.

### Option 3: VS Code Live Server

If you have the "Live Server" extension in VS Code:
1. Right-click on `index.html`
2. Select "Open with Live Server"

## Configuration

### API URL

Enter your API server URL in the input field at the top of the page:
- Default: `http://192.168.1.100:8080`
- Local testing: `http://localhost:8000`

Click "Connect" to establish the connection.

### Auto-Refresh

- Check the "Auto-refresh" checkbox to update data every 10 seconds
- Uncheck to stop automatic updates

### Filters

- **Device Filter**: Select a specific device or "All Devices"
- **Show**: Limit the number of measurements displayed (10, 25, 50, or 100)

## UI Components

### Connection Status
- **Yellow (pulsing)**: Connecting...
- **Green**: Connected successfully
- **Red**: Connection error

### Latest Readings Cards
Shows the most recent reading for each device with:
- Device name
- Temperature (red)
- Humidity (blue)
- Timestamp

### Measurement History Table
Displays all measurements with columns:
- ID
- Device
- Temperature
- Humidity
- Timestamp

## CORS Configuration

For the web UI to communicate with the API, CORS must be enabled on the server. The API has been configured to allow cross-origin requests.

If you see CORS errors in the browser console, ensure the API server is using the updated `main.py` with CORS middleware.

## Troubleshooting

### "Connection failed"
- Check that the API server is running
- Verify the API URL is correct
- Ensure CORS is enabled on the API

### No data displayed
- Check the API has measurements stored
- Try refreshing the page
- Check browser console for errors

### CORS errors
- Make sure the API server has CORS middleware enabled
- Restart the API server after updating `main.py`

## Screenshots

The UI displays:
1. **Header** with connection status
2. **Config bar** for API URL and auto-refresh toggle
3. **Latest readings** cards showing current values per device
4. **Filters** for device and record limit
5. **History table** with all measurements
