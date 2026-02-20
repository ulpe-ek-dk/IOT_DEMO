// DOM Elements
const apiUrlInput = document.getElementById('api-url');
const connectBtn = document.getElementById('connect-btn');
const autoRefreshCheckbox = document.getElementById('auto-refresh');
const statusIndicator = document.getElementById('status-indicator');
const statusText = document.getElementById('status-text');
const latestCards = document.getElementById('latest-cards');
const deviceFilter = document.getElementById('device-filter');
const limitFilter = document.getElementById('limit-filter');
const measurementsBody = document.getElementById('measurements-body');

// State
let apiUrl = apiUrlInput.value;
let refreshInterval = null;
let allMeasurements = [];
let knownDevices = new Set();

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    connectBtn.addEventListener('click', connect);
    autoRefreshCheckbox.addEventListener('change', toggleAutoRefresh);
    deviceFilter.addEventListener('change', applyFilters);
    limitFilter.addEventListener('change', applyFilters);

    // Try to connect on load
    connect();
});

// Connect to API
async function connect() {
    apiUrl = apiUrlInput.value.replace(/\/$/, ''); // Remove trailing slash
    setStatus('connecting');

    try {
        const response = await fetch(`${apiUrl}/`);
        if (response.ok) {
            const data = await response.json();
            if (data.status === 'healthy') {
                setStatus('connected');
                fetchMeasurements();
                toggleAutoRefresh();
            } else {
                setStatus('error', 'Unexpected response');
            }
        } else {
            setStatus('error', `HTTP ${response.status}`);
        }
    } catch (error) {
        setStatus('error', 'Connection failed');
        console.error('Connection error:', error);
    }
}

// Set connection status
function setStatus(status, message = '') {
    statusIndicator.className = 'status-dot';

    switch (status) {
        case 'connecting':
            statusText.textContent = 'Connecting...';
            break;
        case 'connected':
            statusIndicator.classList.add('connected');
            statusText.textContent = 'Connected';
            break;
        case 'error':
            statusIndicator.classList.add('error');
            statusText.textContent = message || 'Error';
            break;
    }
}

// Toggle auto-refresh
function toggleAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }

    if (autoRefreshCheckbox.checked && statusIndicator.classList.contains('connected')) {
        refreshInterval = setInterval(fetchMeasurements, 10000); // 10 seconds
    }
}

// Fetch measurements from API
async function fetchMeasurements() {
    try {
        const response = await fetch(`${apiUrl}/measurements`);
        if (response.ok) {
            allMeasurements = await response.json();
            updateDeviceFilter();
            applyFilters();
            updateLatestCards();
        }
    } catch (error) {
        console.error('Failed to fetch measurements:', error);
    }
}

// Update device filter dropdown
function updateDeviceFilter() {
    const currentValue = deviceFilter.value;

    // Find all unique devices
    allMeasurements.forEach(m => knownDevices.add(m.device_id));

    // Clear and rebuild options
    deviceFilter.innerHTML = '<option value="">All Devices</option>';
    knownDevices.forEach(device => {
        const option = document.createElement('option');
        option.value = device;
        option.textContent = device;
        deviceFilter.appendChild(option);
    });

    // Restore selection
    deviceFilter.value = currentValue;
}

// Apply filters and update table
function applyFilters() {
    const selectedDevice = deviceFilter.value;
    const limit = parseInt(limitFilter.value);

    let filtered = allMeasurements;

    // Filter by device
    if (selectedDevice) {
        filtered = filtered.filter(m => m.device_id === selectedDevice);
    }

    // Apply limit
    filtered = filtered.slice(0, limit);

    updateTable(filtered);
}

// Update the measurements table
function updateTable(measurements) {
    if (measurements.length === 0) {
        measurementsBody.innerHTML = `
            <tr>
                <td colspan="5" class="no-data">No measurements found</td>
            </tr>
        `;
        return;
    }

    measurementsBody.innerHTML = measurements.map(m => `
        <tr>
            <td>${m.id}</td>
            <td>${m.device_id}</td>
            <td class="temp-cell">${m.temperature.toFixed(1)}°C</td>
            <td class="humidity-cell">${m.humidity.toFixed(1)}%</td>
            <td>${formatTimestamp(m.timestamp)}</td>
        </tr>
    `).join('');
}

// Update latest reading cards (one per device)
function updateLatestCards() {
    if (allMeasurements.length === 0) {
        latestCards.innerHTML = `
            <div class="card placeholder">
                <p>No data yet. Connect to API to see measurements.</p>
            </div>
        `;
        return;
    }

    // Get latest reading for each device
    const latestByDevice = new Map();
    allMeasurements.forEach(m => {
        if (!latestByDevice.has(m.device_id)) {
            latestByDevice.set(m.device_id, m);
        }
    });

    // Generate cards
    latestCards.innerHTML = Array.from(latestByDevice.values()).map(m => `
        <div class="card">
            <div class="device-name">${m.device_id}</div>
            <div class="readings">
                <div class="reading">
                    <div class="reading-value temperature">${m.temperature.toFixed(1)}°</div>
                    <div class="reading-label">Temperature</div>
                </div>
                <div class="reading">
                    <div class="reading-value humidity">${m.humidity.toFixed(1)}%</div>
                    <div class="reading-label">Humidity</div>
                </div>
            </div>
            <div class="timestamp">${formatTimestamp(m.timestamp)}</div>
        </div>
    `).join('');
}

// Format timestamp for display
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
      return date.toLocaleString('da-DK', {
        timeZone: 'Europe/Copenhagen' //UTC i databasen, konverteres til lokal tid i browseren
    });
}
