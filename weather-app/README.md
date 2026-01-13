# 🌦️ Weather Dashboard App (React)

A modern **Weather Dashboard** built using **React**, featuring **GPS-based location detection**, **city search**, and a **classic blue UI inspired by old weather applications**.

This project focuses on clean UI, real-world API handling, and professional frontend practices.

---

## ✨ Features

- 📍 Auto-detects current location using browser GPS
- 🔍 Search weather for any city
- 🕒 Three-card layout:
  - **Past** (simulated weather trend)
  - **Current** (real-time weather)
  - **Future** (forecast)
- 🎨 Classic **blue weather UI**
- 🪟 Glassmorphism card design
- 📱 Fully responsive layout
- 🔐 API key secured using environment variables
- ⚡ Fast and lightweight (no heavy UI libraries)

---

## 🛠️ Tech Stack

- **Frontend:** React (Hooks)
- **Styling:** CSS (Grid + Glassmorphism)
- **API:** OpenWeather API
- **Deployment:** Vercel
- **Version Control:** Git & GitHub

---

## 🧠 How the App Works

1. On load, the app detects the user’s location using GPS  
2. Fetches:
   - Current weather data
   - 5-day forecast data
3. Displays:
   - Past weather trend (simulated)
   - Current weather conditions
   - Future forecast
4. Users can override GPS by searching for a city
5. UI updates instantly with clean transitions

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
REACT_APP_WEATHER_API_KEY=your_api_key_here
