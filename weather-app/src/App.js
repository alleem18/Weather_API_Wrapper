import React, { useState } from "react";
import WeatherSearch from "./components/WeatherSearch";
import WeatherDisplay from "./components/WeatherDisplay";
import "./App.css";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [isCached, setIsCached] = useState(false);

  return (
    <div className="App">
      <h1>Weather API Wrapper</h1>
      <WeatherSearch setWeatherData={setWeatherData} setIsCached={setIsCached} />
      {weatherData && <WeatherDisplay data={weatherData} isCached={isCached} />}
    </div>
  );
}

export default App;
