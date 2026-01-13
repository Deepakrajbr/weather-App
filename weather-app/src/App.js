import React, { useEffect, useState, useCallback } from "react";
import "./App.css";

function App() {
  const [current, setCurrent] = useState(null);
  const [past, setPast] = useState(null);
  const [future, setFuture] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [city, setCity] = useState("");
  const [useGPS, setUseGPS] = useState(true);

  
  const getWeatherClass = () => {
    if (!current) return "default";

    const condition = current.weather[0].main.toLowerCase();
    const hour = new Date().getHours();

    if (condition.includes("rain")) return "rainy";
    if (condition.includes("cloud")) return "cloudy";
    if (condition.includes("clear") && (hour < 6 || hour > 18)) return "night";
    if (condition.includes("clear")) return "sunny";

    return "default";
  };

  
  const processWeatherData = useCallback((currentData, forecastData) => {
    setCurrent(currentData);

    const daily = forecastData.list.filter((_, i) => i % 8 === 0);

    setFuture(daily.slice(1, 4));

    const avgTemp =
      daily.slice(0, 3).reduce((s, d) => s + d.main.temp, 0) / 3;

    setPast({
      temp: Math.round(avgTemp),
      desc: daily[0].weather[0].description,
      humidity: daily[0].main.humidity,
    });

    setLoading(false);
  }, []);

  
  const fetchWeatherByCoords = useCallback(
    async (lat, lon) => {
      try {
        setLoading(true);
        setError("");

        const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

        const currentRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        const currentData = await currentRes.json();

        if (currentData.cod !== 200) throw new Error(currentData.message);

        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        const forecastData = await forecastRes.json();

        processWeatherData(currentData, forecastData);
      } catch (err) {
        setError(err.message || "Failed to fetch weather");
        setLoading(false);
      }
    },
    [processWeatherData]
  );

  
  const fetchWeatherByCity = async () => {
    if (!city.trim()) return;

    try {
      setLoading(true);
      setError("");
      setUseGPS(false);

      const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&units=metric&appid=${API_KEY}`
      );
      const currentData = await currentRes.json();

      if (currentData.cod !== 200) throw new Error(currentData.message);

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city.trim()}&units=metric&appid=${API_KEY}`
      );
      const forecastData = await forecastRes.json();

      processWeatherData(currentData, forecastData);
    } catch (err) {
      setError(err.message || "City not found");
      setLoading(false);
    }
  };

  
  useEffect(() => {
    if (!useGPS) return;

    const getLocation = () => {
      if (!navigator.geolocation) {
        setError("Geolocation not supported");
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeatherByCoords(
            pos.coords.latitude,
            pos.coords.longitude
          );
        },
        () => {
          setError("Location permission denied");
          setLoading(false);
        }
      );
    };

    getLocation();
  }, [useGPS, fetchWeatherByCoords]);

 
  if (loading && !current) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }


  return (
    <div className={`app ${getWeatherClass()}`}>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search city (e.g. Delhi)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={fetchWeatherByCity}>Search</button>
        <button onClick={() => setUseGPS(true)}>Use GPS</button>
      </div>

      {error && <p className="error">{error}</p>}

      {current && past && (
        <div className="weather-layout">
          {/* ⬅️ PAST */}
          <div className="card past">
            <h3>Last Week</h3>
            <p className="temp">{past.temp}°C</p>
            <p className="desc">{past.desc}</p>
            <p className="small">Avg Humidity: {past.humidity}%</p>
          </div>

          {/* 🟩 CURRENT */}
          <div className="card current">
            <h2>{current.name}</h2>
            <p className="big-temp">{Math.round(current.main.temp)}°C</p>
            <p className="desc">{current.weather[0].description}</p>

            <div className="extra">
              <span>💧 {current.main.humidity}%</span>
              <span>🌬️ {current.wind.speed} m/s</span>
            </div>
          </div>

          {/* ➡️ FUTURE */}
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
      )}
    </div>
  );
}

export default App;
