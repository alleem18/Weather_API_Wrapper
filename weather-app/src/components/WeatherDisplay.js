import React from "react";

const WeatherDisplay = ({ data, isCached }) => {
  const renderForecast = () => {
    return data.days.map((day, index) => (
      <div key={index}>
        <h3>{day.datetime}</h3>
        <p>
          <strong>Max Temp:</strong> {day.tempmax}°C
        </p>
        <p>
          <strong>Min Temp:</strong> {day.tempmin}°C
        </p>
        <p>
          <strong>Conditions:</strong> {day.conditions}
        </p>
      </div>
    ));
  };

  const renderCurrent = () => (
    <div>
      <h2>Current Weather</h2>
      <p>
        <strong>Temperature:</strong> {data.temp}°C
      </p>
      <p>
        <strong>Feels Like:</strong> {data.feelslike}°C
      </p>
      <p>
        <strong>Conditions:</strong> {data.conditions}
      </p>
      <p>
        <strong>Humidity:</strong> {data.humidity}%
      </p>
      <p>
        <strong>Wind Speed:</strong> {data.windspeed} km/h
      </p>
    </div>
  );

  return (
    <div>
      <h2>{isCached ? "Data from Cache" : "Live Data"}</h2>
      {data.days ? renderForecast() : renderCurrent()}
    </div>
  );
};

export default WeatherDisplay;
