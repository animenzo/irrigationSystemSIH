import React, { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const Weather = () => {
  const [city, setCity] = useState("Udaipur");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [coords, setCoords] = useState({ lat: 24.5983, lon: 73.7242 }); // Default: Udaipur
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [activeDay, setActiveDay] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounce user input for search suggestions
  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    const timeoutId = setTimeout(async () => {
      const resp = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
      );
      setSuggestions(resp.data || []);
    }, 350);
    return () => clearTimeout(timeoutId);
  }, [query]);

  // Fetch weather + forecast data when coordinates change
  useEffect(() => {
    if (!coords.lat || !coords.lon) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        // Current weather
        const weatherRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=metric`
        );
        setWeather(weatherRes.data);

        // Forecast
        const forecastRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=metric`
        );
        const noonForecasts = forecastRes.data.list.filter(item => item.dt_txt.includes("12:00:00"));
        setForecast(noonForecasts.slice(0, 7));
        setActiveDay(0);
        setCity(weatherRes.data.name);
        setError(null);
      } catch (err) {
        setError("Weather data could not be loaded.");
        setWeather(null);
        setForecast([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [coords, API_KEY]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (suggestions.length > 0 && query) {
      selectSuggestion(suggestions[0]);
    }
  };

  const selectSuggestion = (sugg) => {
    setCoords({ lat: sugg.lat, lon: sugg.lon });
    setCity(
      sugg.name +
        (sugg.state ? ", " + sugg.state : "") +
        ", " +
        sugg.country
    );
    setQuery("");
    setSuggestions([]);
  };

  const now = new Date();
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const shortDayNames = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  const item = activeDay === 0 ? weather : forecast[activeDay];
  // Use OpenWeather icon image
  const mainIcon =
    item?.weather?.[0]?.icon
      ? `https://openweathermap.org/img/wn/${item.weather[0].icon}@4x.png`
      : "";

  const temp = item?.main?.temp || item?.temp;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-2">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl flex p-8 gap-8">
        {/* Left section */}
        <div className="w-1/3 flex flex-col">
          <form onSubmit={handleSearch} className="mb-8 relative">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search for places..."
              className="px-4 py-2 bg-gray-50 rounded-lg w-full focus:outline-none placeholder:text-gray-400 pr-10"
            />
            <span className="absolute right-3 top-2 text-gray-400">🔍</span>
            {suggestions.length > 0 && (
              <div className="absolute z-20 left-0 right-0 bg-white border rounded-lg mt-1 overflow-hidden shadow-lg">
                {suggestions.map((sugg, idx) => (
                  <div
                    key={idx}
                    className="p-2 cursor-pointer hover:bg-blue-50"
                    onMouseDown={() => selectSuggestion(sugg)}
                  >
                    {sugg.name}{sugg.state ? `, ${sugg.state}` : ""}, {sugg.country}
                  </div>
                ))}
              </div>
            )}
          </form>
          <div className="flex flex-col items-center flex-1">
            {mainIcon && (
              <img src={mainIcon} alt={item?.weather?.[0]?.description} className="w-32 h-32 mb-4" />
            )}
            <div className="text-5xl font-bold">{Math.round(temp)}°C</div>
            <div className="text-gray-500 text-lg mb-4 capitalize">
              {dayNames[now.getDay()]}, {now.getHours()}:{now.getMinutes().toString().padStart(2, "0")}
            </div>
            <div className="text-md font-semibold mb-7 capitalize">
              {item?.weather?.[0]?.description}
            </div>
            
            <div className="text-xs text-gray-500 mt-2">{city}</div>
          </div>
        </div>
        {/* Right section */}
        <div className="flex-1 flex flex-col">
          {/* Week */}
          <div className="flex mb-6 items-center">
            <span className="font-semibold text-gray-900 border-b-2 border-gray-800 pb-1 mr-5">
              Week
            </span>
          </div>
          <div className="grid grid-cols-7 gap-2 mb-8">
            {[weather, ...forecast].slice(0, 7).map((itm, i) => (
              <div
                key={i}
                className={`bg-gray-50 rounded-xl p-2 flex flex-col items-center cursor-pointer transition ring-1 ring-inset hover:ring-blue-300 ${
                  i === activeDay ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setActiveDay(i)}
              >
                <span className={`text-xs mb-1 ${i === 0 ? "text-blue-700 font-semibold" : "text-gray-400"}`}>
                  {i === 0 ? "Today" : 
                  itm?.dt ? shortDayNames[new Date(itm.dt * 1000).getDay()] : ""}
                </span>
                {itm?.weather?.[0]?.icon && (
                  <img
                    src={`https://openweathermap.org/img/wn/${itm.weather[0].icon}@2x.png`}
                    alt={itm.weather[0].description}
                    className="w-14 h-14 mb-1"
                  />
                )}
                <span className="font-bold text-lg">{Math.round(itm?.main?.temp || itm?.temp)}°</span>
              </div>
            ))}
          </div>
          {/* Highlights */}
          <div>
            <div className="text-lg font-semibold mb-3">Day's Highlights</div>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-gray-50 p-5 flex flex-col items-center">
                <div className="text-sm text-gray-500 mb-2">Wind Status</div>
                <span role="img" aria-label="wind" className="text-3xl mb-2">💨</span>
                <div className="text-2xl font-bold">
                  {item?.wind?.speed} <span className="text-sm font-normal">m/s</span>
                </div>
                <div className="text-xs text-gray-400 mt-2">{item?.wind?.deg}°</div>
              </div>
              <div className="rounded-xl bg-gray-50 p-5 flex flex-col items-center">
                <div className="text-sm text-gray-500 mb-2">Humidity</div>
                <span role="img" aria-label="humidity" className="text-3xl mb-2">💧</span>
                <div className="text-2xl font-bold">{item?.main?.humidity || item?.humidity}%</div>
                <div className="text-xs text-gray-400 mt-2">Normal</div>
              </div>
              <div className="rounded-xl bg-gray-50 p-5 flex flex-col items-center">
                <div className="text-sm text-gray-500 mb-2">Visibility</div>
                <span role="img" aria-label="eye" className="text-3xl mb-2">👁️</span>
                <div className="text-2xl font-bold">
                  {item?.visibility ? (item.visibility / 1000).toFixed(1) : "-"} km
                </div>
                <div className="text-xs text-gray-400 mt-2">Average</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-30 z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      {error && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-30 z-50">
          <div className="text-red-500 font-bold text-lg">{error}</div>
        </div>
      )}
    </div>
  );
};

export default Weather;
