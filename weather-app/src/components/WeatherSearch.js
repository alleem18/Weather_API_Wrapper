import React, { useState } from "react";
import axios from "axios";

const WeatherSearch = ({ setWeatherData, setIsCached }) => {
  const [city, setCity] = useState("");
  const [type, setType] = useState("forecast"); // Default to "forecast"
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");

  const fetchWeather = async () => {
    if (!city) {
      alert("Please enter a city name!");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5001/weather", {
        params: { city, type, date1, date2 },
      });
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
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="forecast">Forecast</option>
        <option value="current">Current Weather</option>
      </select>
      {type === "forecast" && (
        <>
          <input
            type="date"
            placeholder="Start Date"
            value={date1}
            onChange={(e) => setDate1(e.target.value)}
          />
          <input
            type="date"
            placeholder="End Date"
            value={date2}
            onChange={(e) => setDate2(e.target.value)}
          />
        </>
      )}
      <button onClick={fetchWeather}>Get Weather</button>
    </div>
  );
};

export default WeatherSearch;
