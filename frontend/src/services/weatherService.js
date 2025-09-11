import axios from 'axios';

const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your actual API key from .env or config
const LAT = 24.5854; // Udaipur, India latitude
const LON = 73.7125; // Udaipur, India longitude

export const getWeather = async () => {
  try {
    // Current weather with 1h rain data
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`
    );
    return {
      temperature: Math.round(response.data.main.temp),
      humidity: response.data.main.humidity,
      description: response.data.weather[0].description,
      rain: response.data.rain ? response.data.rain['1h'] || 0 : 0,
      city: response.data.name
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};