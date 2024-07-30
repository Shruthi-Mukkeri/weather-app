// src/App.tsx
import { useState, useEffect } from "react";
import { WeatherData } from "./types";
import "./App.css";

function App() {
  const APIKey = "ed898e30a23a33e9ddc74eb97c5703a1";
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=${APIKey}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data: WeatherData) => {
        setWeather(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [APIKey]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {weather ? (
        <div>
          <h1>Weather in {weather.name}</h1>
          <p>Temperature: {weather.main.temp}K</p>
          <p>Weather: {weather.weather[0]?.description}</p>
          <p>Wind Speed: {weather.wind.speed} m/s</p>
          <p>Visibility: {weather.visibility} meters</p>
        </div>
      ) : (
        <p>No weather data available</p>
      )}
    </div>
  );
}

export default App;
