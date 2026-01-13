import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [current, setCurrent] = useState(null);
  const [past, setPast] = useState(null);
  const [future, setFuture] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Run once on app load
  useEffect(() => {
    const getLocation = () => {
      if (!navigator.geolocation) {
        setError("Geolocation not supported");
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeather(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          setError("Location permission denied");
          setLoading(false);
        }
      );
    };

    getLocation();
  }, []);

  // 🔹 Fetch weather using FREE APIs
  const fetchWeather = async (lat, lon) => {
    try {
      const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

      /* ================= CURRENT WEATHER ================= */
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      const currentData = await currentRes.json();

      if (currentData.cod !== 200) {
        setError(currentData.message);
        setLoading(false);
        return;
      }

      /* ================= FORECAST (5 DAYS) ================= */
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      const forecastData = await forecastRes.json();

      /* ================= CURRENT ================= */
      setCurrent(currentData);

      /* ================= FUTURE (1 ENTRY PER DAY) ================= */
      const dailyForecast = forecastData.list.filter((_, i) => i % 8 === 0);
      setFuture(dailyForecast.slice(1, 4));

      /* ================= PAST (SIMULATED) ================= */
      const avgTemp =
        dailyForecast
          .slice(0, 3)
          .reduce((sum, day) => sum + day.main.temp, 0) / 3;

      setPast({
        temp: Math.round(avgTemp),
        desc: dailyForecast[0].weather[0].description,
        humidity: dailyForecast[0].main.humidity,
      });

      setLoading(false);
    } catch (err) {
      setError("Failed to fetch weather");
      setLoading(false);
    }
  };

  /* ================= SAFE RENDERING ================= */
  if (loading || !current || !past) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  if (error) {
    return <h2 style={{ color: "red", textAlign: "center" }}>{error}</h2>;
  }

  /* ================= UI ================= */
  return (
    <div className="app">
      <div className="weather-layout">

        {/* ⬅️ PAST CARD */}
        <div className="card past">
          <h3>Last Week</h3>
          <p className="temp">{past.temp}°C</p>
          <p className="desc">{past.desc}</p>
          <p className="small">Avg Humidity: {past.humidity}%</p>
        </div>

        {/* 🟩 CURRENT CARD */}
        <div className="card current">
          <h2>Now</h2>
          <p className="big-temp">{Math.round(current.main.temp)}°C</p>
          <p className="desc">{current.weather[0].description}</p>

          <div className="extra">
            <span>💧 {current.main.humidity}%</span>
            <span>🌬️ {current.wind.speed} m/s</span>
          </div>
        </div>

        {/* ➡️ FUTURE CARD */}
        <div className="card future">
          <h3>Next Days</h3>
          <div className="forecast">
            {future.map((day, i) => (
              <div key={i}>
                {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                  weekday: "short",
                })}{" "}
                🌤️ {Math.round(day.main.temp)}°
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
