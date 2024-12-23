import React from "react";

const WeatherDisplay = ({ data, isCached }) => {
  return (
    <div>
      <h2>Weather Details</h2>
      <p><strong>Temperature:</strong> {data.temperature}°C</p>
      <p><strong>Condition:</strong> {data.condition}</p>
      <p><strong>Source:</strong> {isCached ? "Cache" : "API"}</p>
    </div>
  );
};

export default WeatherDisplay;
