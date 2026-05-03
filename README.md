# synent-task6-weatherapp-rishi

**Synent Technologies Internship — Task 6: API Integration Project**  
Candidate: Sanja Rishi Bharatbhai | ID: SYN/H2/IP1807

---

## 🌤 About

A weather web app built with vanilla HTML, CSS, and JavaScript. Fetches real-time weather data and 5-day forecasts from the OpenWeatherMap API.

---

## ✅ Features

- 🔍 **City Search** — search any city worldwide
- 📍 **Geolocation** — one-click weather for your current location
- 🌡 **Unit Toggle** — switch between °C and °F instantly
- 📅 **5-Day Forecast** — daily high/low with icons
- 💧 **Detailed Stats** — humidity, wind speed & direction, visibility, pressure, sunrise/sunset
- ⏳ **Loading State** — animated spinner while fetching
- ⚠️ **Error Handling** — friendly messages for bad city names, network errors, denied location
- 🎨 **Dynamic Background** — sky gradient changes based on weather condition
- 🕐 **Live Clock** — real-time clock in header
- 📱 **Fully Responsive** — works on mobile and desktop

---

## 🛠 Tech Stack

| Layer    | Technology                   |
|----------|------------------------------|
| Frontend | HTML5, CSS3, Vanilla JS      |
| API      | OpenWeatherMap (Free Tier)   |
| Fonts    | Bebas Neue, DM Sans, Space Mono |

---

## ⚙️ Setup

### 1. Get a Free API Key
1. Sign up at [openweathermap.org](https://openweathermap.org/api)
2. Go to **API Keys** tab in your account
3. Copy your key (takes ~10 min to activate)

### 2. Add Your API Key
Open `static/js/app.js` and replace line 8:
```js
const API_KEY = 'YOUR_API_KEY_HERE';
```
With your actual key:
```js
const API_KEY = 'abc123yourkeyhere';
```

### 3. Run the App
Simply open `index.html` in your browser — no server needed.

> **Tip:** Use VS Code Live Server extension for best experience.

---

## 📁 Project Structure

```
synent-task6-weatherapp-sanja/
├── index.html              # Main HTML — all sections and states
├── static/
│   ├── css/
│   │   └── style.css       # Full design system
│   └── js/
│       └── app.js          # API logic, state, rendering
└── README.md
```

---

## 🔗 API Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `/weather` | Current weather by city or coordinates |
| `/forecast` | 5-day / 3-hour forecast data |

---

*Built for Synent Technologies Web Development Internship Program*