import React, { useState } from "react";
import axios from "axios";

const WeatherSearch = ({ setWeatherData, setIsCached }) => {
  const [city, setCity] = useState("");

  const fetchWeather = async () => {
    if (!city) return alert("Please enter a city name!");
    try {
      const response = await axios.get(`http://localhost:5000/weather?city=${city}`);
      setWeatherData(response.data.weather);
      setIsCached(response.data.cached);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert("Failed to fetch weather data. Please try again.");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={fetchWeather}>Get Weather</button>
    </div>
  );
};

export default WeatherSearch;
