require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const redis = require("redis");

const app = express(); // Initialize express app
const PORT = process.env.PORT || 5001;

// CORS Configuration
const corsOptions = {
  origin: "http://localhost:3000", // Allow frontend origin
  methods: ["GET", "POST"], // Allowed methods
};
app.use(cors(corsOptions)); // Use CORS middleware

// Redis client setup
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

// Connect Redis client
(async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
  }
})();

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

// Helper function to fetch weather data
const fetchWeatherData = async (location, date1, date2) => {
  let url = `${process.env.WEATHER_API_URL}/${location}`;
  if (date1) {
    url += `/${date1}`;
    if (date2) {
      url += `/${date2}`;
    }
  }
  url += `?key=${process.env.WEATHER_API_KEY}`;
  const response = await axios.get(url);
  return response.data;
};

// Helper function to fetch current weather
const fetchCurrentWeather = async (location) => {
  const url = `${process.env.WEATHER_API_URL}/${location}/today?key=${process.env.WEATHER_API_KEY}`;
  const response = await axios.get(url);
  return response.data.currentConditions;
};

// Endpoint to get weather data
app.get("/weather", async (req, res) => {
    const { city, date1, date2, type } = req.query;
  
    if (!city) {
      return res.status(400).json({ error: "City name is required" });
    }
  
    try {
      let cacheKey;
      let weatherData;
  
      if (type === "current") {
        cacheKey = `current-${city}`;
        const cacheData = await redisClient.get(cacheKey);
  
        if (cacheData) {
          console.log("Cache hit for current weather");
          return res.json({ cached: true, weather: JSON.parse(cacheData) });
        }
  
        console.log("Cache miss for current weather");
        weatherData = await fetchCurrentWeather(city);
  
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(weatherData));
      } else {
        cacheKey = `forecast-${city}-${date1 || "default"}-${date2 || "default"}`;
        const cacheData = await redisClient.get(cacheKey);
  
        if (cacheData) {
          console.log("Cache hit for forecast");
          return res.json({ cached: true, weather: JSON.parse(cacheData) });
        }
  
        console.log("Cache miss for forecast");
        weatherData = await fetchWeatherData(city, date1, date2);
  
        await redisClient.setEx(cacheKey, 43200, JSON.stringify(weatherData));
      }
  
      res.json({ cached: false, weather: weatherData });
    } catch (error) {
      console.error("Error fetching weather data:", error);
      res.status(500).json({ error: error.message || "Failed to fetch weather data" });
    }
  });
  

// Graceful shutdown
process.on("SIGINT", async () => {
  try {
    await redisClient.quit();
    console.log("Redis client disconnected");
    process.exit(0);
  } catch (error) {
    console.error("Error during Redis disconnection:", error);
    process.exit(1);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
