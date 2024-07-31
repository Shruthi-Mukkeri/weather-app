// src/App.tsx
import { useState, useEffect } from "react";
import { WeatherData } from "./types";
import "./App.css";
import Map from "./Components/Map";

function App() {
  const APIKey = "ed898e30a23a33e9ddc74eb97c5703a1";
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: 17.368497196789402,
    lng: 78.48538398742677,
  });

  useEffect(() => {
    setLoading(true);
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lng}&appid=${APIKey}`
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
  }, [APIKey, coords]);

  const handleMapClick = (lat: number, lng: number) => {
    setCoords({ lat, lng });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container">
      <div className="row vh-100">
        <div className="col-md-8 m-auto ">
          <div className="row justify-content-center align-item-center  border">
            <div className="col-md-4 m-auto ">
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
            <div className="col-md-8 m-auto">
              <Map onMapClick={handleMapClick} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
