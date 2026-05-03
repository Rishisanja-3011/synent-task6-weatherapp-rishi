/* ─────────────────────────────────────────────────────────────────
   Atmos — Weather App · Task 6 · Synent Technologies Internship
   Candidate: Sanja Rishi Bharatbhai · SYN/H2/IP1807
   ───────────────────────────────────────────────────────────────── */

// ── CONFIG ──────────────────────────────────────────────────────────
const API_KEY  = '117539ea663e3efb4bab6b70484f846e'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// ── STATE ────────────────────────────────────────────────────────────
let currentUnit  = 'metric';    // 'metric' | 'imperial'
let lastCity     = null;
let lastLat      = null;
let lastLon      = null;
let clockInterval = null;

// ── DOM REFS ─────────────────────────────────────────────────────────
const searchInput   = document.getElementById('searchInput');
const searchBtn     = document.getElementById('searchBtn');
const locateBtn     = document.getElementById('locateBtn');
const btnC          = document.getElementById('btnC');
const btnF          = document.getElementById('btnF');
const loader        = document.getElementById('loader');
const errorState    = document.getElementById('errorState');
const errorMsg      = document.getElementById('errorMsg');
const retryBtn      = document.getElementById('retryBtn');
const emptyState    = document.getElementById('emptyState');
const weatherContent = document.getElementById('weatherContent');
const headerTime    = document.getElementById('headerTime');
const bgLayer       = document.getElementById('bgLayer');

// ── WEATHER ICON MAP ─────────────────────────────────────────────────
const ICON_MAP = {
  '01d': '☀️', '01n': '🌙',
  '02d': '⛅', '02n': '🌥️',
  '03d': '☁️', '03n': '☁️',
  '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️',
  '10d': '🌦️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️',
  '13d': '❄️', '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️',
};

// ── SKY GRADIENTS (dynamic background) ───────────────────────────────
const SKY_MAP = {
  '01d': ['#1a3a6b', '#2d6abf'],
  '01n': ['#020408', '#0d1a35'],
  '02d': ['#1a2e4a', '#2d5180'],
  '02n': ['#050a12', '#0d1f35'],
  '09d': ['#1a2030', '#252e40'],
  '09n': ['#080c14', '#101520'],
  '10d': ['#192030', '#263042'],
  '11d': ['#0f1520', '#1a2230'],
  '13d': ['#1e2a3a', '#2a3d55'],
  '50d': ['#1a1e28', '#252a38'],
};

function getSky(icon) {
  const key = icon in SKY_MAP ? icon : icon.replace('n','d');
  return SKY_MAP[key] || ['#0f1729', '#1a2744'];
}

// ── WIND DIRECTION ────────────────────────────────────────────────────
function degToDir(deg) {
  const dirs = ['N','NE','E','SE','S','SW','W','NW'];
  return dirs[Math.round(deg / 45) % 8];
}

// ── CLOCK ─────────────────────────────────────────────────────────────
function startClock() {
  if (clockInterval) clearInterval(clockInterval);
  function tick() {
    const now = new Date();
    headerTime.textContent = now.toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  }
  tick();
  clockInterval = setInterval(tick, 1000);
}

// ── STATE MANAGEMENT ─────────────────────────────────────────────────
function showLoader() {
  loader.classList.add('active');
  errorState.classList.remove('active');
  weatherContent.classList.remove('active');
  emptyState.classList.add('hidden');
}

function showError(msg) {
  loader.classList.remove('active');
  errorMsg.textContent = msg;
  errorState.classList.add('active');
  weatherContent.classList.remove('active');
}

function showWeather() {
  loader.classList.remove('active');
  errorState.classList.remove('active');
  emptyState.classList.add('hidden');
  weatherContent.classList.add('active');
}

// ── FORMAT HELPERS ────────────────────────────────────────────────────
function formatTime(unix, offset) {
  const d = new Date((unix + offset) * 1000);
  return d.toUTCString().slice(17, 22);
}

function formatDay(unix) {
  return new Date(unix * 1000).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
}

function unitLabel() {
  return currentUnit === 'metric' ? '°C' : '°F';
}

function windLabel(speed) {
  return currentUnit === 'metric'
    ? `${Math.round(speed * 3.6)} km/h`
    : `${Math.round(speed)} mph`;
}

// ── RENDER CURRENT WEATHER ────────────────────────────────────────────
function renderCurrent(data) {
  const icon = data.weather[0].icon;
  const [skyA, skyB] = getSky(icon);

  // Update background
  bgLayer.style.setProperty('--sky-a', skyA);
  bgLayer.style.setProperty('--sky-b', skyB);
  document.documentElement.style.setProperty('--sky-a', skyA);
  document.documentElement.style.setProperty('--sky-b', skyB);

  document.getElementById('cityName').textContent    = data.name;
  document.getElementById('countryName').textContent = data.sys.country;
  document.getElementById('weatherDesc').textContent = data.weather[0].description;
  document.getElementById('weatherIcon').textContent = ICON_MAP[icon] || '🌤';
  document.getElementById('tempValue').textContent   = Math.round(data.main.temp);
  document.getElementById('tempUnit').textContent    = unitLabel();
  document.getElementById('feelsLike').textContent   = `Feels like ${Math.round(data.main.feels_like)}${unitLabel()}`;
  document.getElementById('lastUpdated').textContent = `Updated · ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;

  // Stats
  const hum = data.main.humidity;
  document.getElementById('humidity').textContent  = `${hum}%`;
  document.getElementById('humidityBar').style.width = `${hum}%`;
  document.getElementById('windSpeed').textContent = windLabel(data.wind.speed);
  document.getElementById('windDir').textContent   = `Direction: ${degToDir(data.wind.deg || 0)}`;
  document.getElementById('visibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;
  document.getElementById('pressure').textContent  = `${data.main.pressure} hPa`;
  document.getElementById('sunrise').textContent   = formatTime(data.sys.sunrise, data.timezone);
  document.getElementById('sunset').textContent    = formatTime(data.sys.sunset, data.timezone);
}

// ── RENDER FORECAST ───────────────────────────────────────────────────
function renderForecast(data) {
  const grid = document.getElementById('forecastGrid');
  grid.innerHTML = '';


  // OpenWeatherMap 5-day forecast returns 3h intervals → pick 1 per day (noon)
  const daily = {};
  data.list.forEach(item => {
    const day = new Date(item.dt * 1000).toDateString();
    if (!daily[day]) daily[day] = [];
    daily[day].push(item);
  });

  const days = Object.keys(daily).slice(0, 5);
  days.forEach((day, i) => {
    const items  = daily[day];
    const mid    = items[Math.floor(items.length / 2)];
    const temps  = items.map(it => it.main.temp);
    const high   = Math.round(Math.max(...temps));
    const low    = Math.round(Math.min(...temps));
    const icon   = mid.weather[0].icon;
    const desc   = mid.weather[0].main;
    const label  = i === 0 ? 'TODAY' : formatDay(mid.dt);

    const card = document.createElement('div');
    card.className = 'forecast-card';
    card.style.animationDelay = `${i * 0.08}s`;
    card.innerHTML = `
      <div class="fc-day">${label}</div>
      <span class="fc-icon">${ICON_MAP[icon] || '🌤'}</span>
      <div>
        <span class="fc-high">${high}${unitLabel()}</span>
        <span class="fc-low">${low}${unitLabel()}</span>
      </div>
      <div class="fc-desc">${desc}</div>
    `;
    grid.appendChild(card);
  });
}

// ── FETCH WEATHER BY CITY ────────────────────────────────────────────
async function fetchByCity(city) {
  showLoader();
  lastCity = city;
  lastLat = null;
  lastLon = null;

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(`${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=${currentUnit}&appid=${API_KEY}`),
      fetch(`${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=${currentUnit}&appid=${API_KEY}`)
    ]);

    if (!currentRes.ok) {
      const err = await currentRes.json();
      throw new Error(err.message || 'City not found.');
    }

    const current  = await currentRes.json();
    const forecast = await forecastRes.json();

    renderCurrent(current);
    renderForecast(forecast);
    showWeather();

  } catch (err) {
    showError(err.message === 'Failed to fetch'
      ? 'Network error. Check your connection.'
      : `Error: ${err.message}`
    );
  }
}

// ── FETCH WEATHER BY COORDS ───────────────────────────────────────────
async function fetchByCoords(lat, lon) {
  showLoader();
  lastLat = lat;
  lastLon = lon;
  lastCity = null;

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${currentUnit}&appid=${API_KEY}`),
      fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${currentUnit}&appid=${API_KEY}`)
    ]);

    if (!currentRes.ok) throw new Error('Unable to fetch weather for your location.');

    const current  = await currentRes.json();
    const forecast = await forecastRes.json();

    renderCurrent(current);
    renderForecast(forecast);
    showWeather();

  } catch (err) {
    showError(err.message === 'Failed to fetch'
      ? 'Network error. Check your connection.'
      : `Error: ${err.message}`
    );
  }
}

// ── GEOLOCATION ──────────────────────────────────────────────────────
function handleLocate() {
  if (!navigator.geolocation) {
    showError('Geolocation is not supported by your browser.');
    return;
  }
  showLoader();
  navigator.geolocation.getCurrentPosition(
    pos => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
    err => showError('Location access denied. Please search manually.')
  );
}

// ── UNIT TOGGLE ───────────────────────────────────────────────────────
function handleUnitToggle(unit) {
  if (unit === currentUnit) return;
  currentUnit = unit;

  btnC.classList.toggle('active', unit === 'metric');
  btnF.classList.toggle('active', unit === 'imperial');

  // Re-fetch with new unit
  if (lastCity)            fetchByCity(lastCity);
  else if (lastLat !== null) fetchByCoords(lastLat, lastLon);
}

// ── EVENT LISTENERS ───────────────────────────────────────────────────
searchBtn.addEventListener('click', () => {
  const city = searchInput.value.trim();
  if (city) fetchByCity(city);
});

searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const city = searchInput.value.trim();
    if (city) fetchByCity(city);
  }
});

locateBtn.addEventListener('click', handleLocate);

btnC.addEventListener('click', () => handleUnitToggle('metric'));
btnF.addEventListener('click', () => handleUnitToggle('imperial'));

retryBtn.addEventListener('click', () => {
  if (lastCity)              fetchByCity(lastCity);
  else if (lastLat !== null) fetchByCoords(lastLat, lastLon);
  else {
    errorState.classList.remove('active');
    emptyState.classList.remove('hidden');
  }
});

// ── INIT ─────────────────────────────────────────────────────────────
startClock();

// Auto-load with a default city on first visit
fetchByCity('Mumbai');