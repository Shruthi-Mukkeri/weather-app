import { useState, useEffect } from "react";
import { WeatherData } from "./types";
import "./App.css";
import Map from "./Components/Map";

function App() {
  const APIKey = "ed898e30a23a33e9ddc74eb97c5703a1";
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number }>(() => {
    return {
      lat: 17.368497196789402,
      lng: 78.48538398742677,
    };
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
    <div style={{ boxShadow: " inset 0px 1px 73px -5px rgba(0,0,0,0.5" }}>
      <div className="container">
        <div className="row vh-100">
          <div className="col-md-9 m-auto ">
            <div className="row justify-content-center align-item-center shadow border">
              <div className="col-md-5 m-auto ">
                <div className="p-2">
                  {" "}
                  {weather ? (
                    <div className="">
                      <h1>
                        Weather in{" "}
                        <span className="fw-bold text-info">
                          {weather.name}
                        </span>
                      </h1>
                      <p>
                        Temperature:{" "}
                        <span className="fw-bold">{weather.main.temp}K</span>
                      </p>
                      <p>
                        Weather:{" "}
                        <span className="fw-bold">
                          {weather.weather[0]?.description}
                        </span>
                      </p>
                      <p>
                        Wind Speed:{" "}
                        <span className="fw-bold">
                          {weather.wind.speed} m/s
                        </span>
                      </p>
                      <p>
                        Visibility:{" "}
                        <span className="fw-bold">
                          {weather.visibility} meters
                        </span>
                      </p>
                    </div>
                  ) : (
                    <p>No weather data available</p>
                  )}
                </div>
              </div>
              <div className="col-md-7 m-auto p-0">
                <Map onMapClick={handleMapClick} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
