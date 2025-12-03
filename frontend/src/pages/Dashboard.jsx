// components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Cloud, CloudDrizzle, Sun, CloudSnow, Zap,
  Droplets, Thermometer, Power, Calendar, RefreshCw,
  Play, AlertTriangle, Settings
} from "lucide-react";
import ConfirmationModal from '../components/ConfirmationModal';
import { api } from '../services/api';
import { useSchedules } from "../contexts/ScheduleContext";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';


const Dashboard = () => {
  const { schedules } = useSchedules();
  console.log("Schedules:", schedules);
  const navigate = useNavigate();

  // Utility to get next date for a single schedule
  const getNextRunDate = (schedule) => {
    if (!schedule?.days || !schedule.time) return null;

    const now = new Date();
    const [hour, minute] = schedule.time.split(":").map(Number);

    for (let i = 0; i <= 7; i++) {
      const checkDate = new Date(now);
      checkDate.setDate(now.getDate() + i);
      checkDate.setHours(hour, minute, 0, 0);

      const dayIndex = checkDate.getDay(); // 0 = Sunday
      if (schedule.days[dayIndex]) return checkDate;
    }

    return null;
  };

  // Find the next schedule among all schedules
  let nextSchedule = null;
  let nextDate = null;

  schedules?.forEach((schedule) => {
    const scheduleDate = getNextRunDate(schedule);
    if (scheduleDate && (!nextDate || scheduleDate < nextDate)) {
      nextDate = scheduleDate;
      nextSchedule = schedule;
    }
  });

  const formattedDate = nextDate
    ? nextDate.toLocaleString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    })
    : null;

  const handleEdit = () => {
    if (nextSchedule) navigate(`/edit-schedule/${nextSchedule._id}`);
  };




  const [dashboardData, setDashboardData] = useState({
    sensors: {},
    weather: {},
    device: {
      serverStatus: 0,
      status: "offline",
      lastSeen: null,
      message: "Loading..."
    },
    alerts: []
  });

  const [mode, setMode] = useState("manual"); // "manual" or "ai"
  const [loading, setLoading] = useState(false);
  const [showPumpModal, setShowPumpModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [targetMoisture, setTargetMoisture] = useState(30);
  const [pumpAction, setPumpAction] = useState(null);
  const [selectedMoisture, setSelectedMoisture] = useState('average');

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (dashboardData.sensors.targetMoisture) {
      setTargetMoisture(dashboardData.sensors.targetMoisture);
    }
  }, [dashboardData.sensors.targetMoisture]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/blynk/dashboard-data');
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (main, description) => {
    switch (main?.toLowerCase()) {
      case 'clear': return <Sun className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-yellow-500" />;
      case 'clouds': return <Cloud className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-500" />;
      case 'rain': case 'drizzle': return <CloudDrizzle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-500" />;
      case 'snow': return <CloudSnow className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-300" />;
      case 'thunderstorm': return <Zap className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-purple-500" />;
      default: return <Cloud className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-500" />;
    }
  };

  const handlePumpToggle = () => {
    const newAction = !dashboardData.sensors.pumpStatus;
    setPumpAction(newAction ? 'start' : 'stop');
    if (newAction) {
      setShowPumpModal(true);
    } else {
      setShowConfirmModal(true);
    }
  };

  const handlePumpModalConfirm = () => {
    setShowPumpModal(false);
    setShowConfirmModal(true);
  };

  const handleFinalConfirm = async () => {
    try {
      setLoading(true);
      setShowConfirmModal(false);
      const action = pumpAction === 'start';
      const moisture = pumpAction === 'start' ? targetMoisture : null;

      await api.post('/blynk/pump/control', {
        action,
        targetMoisture: moisture,
        farmId: 'demo-farm-id'  // Dummy for demo
      });

      // Update local state for immediate feedback
      setDashboardData(prev => ({
        ...prev,
        sensors: {
          ...prev.sensors,
          pumpControl: action ? 1 : 0,
          targetMoisture: moisture || prev.sensors.targetMoisture
        }
      }));

      await fetchDashboardData(); // Refresh data from Arduino
    } catch (error) {
      console.error('Error controlling pump:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white backdrop-blur-2xl">
      {/* ENHANCED HEADER WITH REAL WEATHER - Fully Responsive */}
      <div className="absolute inset-0 -z-20">
        <img src="/bg15.jpg" className="object-cover w-full blur-[8px] lg:h-[110vh] h-full" alt="" />
        <div className="absolute inset-0"></div>
      </div>

      <div className="bg-zinc-700/60 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 sm:py-4 space-y-3 sm:space-y-0">
            {/* Left side - Logo and badges */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center">
                  <img src="/smartyFarm.svg" alt="" />
                </div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">Dashboard</h1>
              </div>

              {/* Badges - Stack on mobile, row on larger screens */}
              <div className="flex flex-wrap gap-2 sm:space-x-3">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                  <img className="h-6 w-6 sm:h-8 sm:w-8 rounded-full" src="/farm.png" alt="" />
                  Demo Farm
                </span>
                <span className="bg-green-100 text-green-700 px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-medium items-center gap-1 sm:gap-2 flex">
                  <img className="rounded-full h-6 w-6 sm:h-8 sm:w-8" src="/crop.jpg" alt="" />
                  Wheat
                </span>
                <span className="bg-gray-100 text-yellow-300 px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-medium gap-1 sm:gap-2 items-center flex">
                  <img className="h-6 w-6 sm:h-8 sm:w-8 rounded-full" src="/land.jpg" alt="" />
                  5 Acres
                </span>
              </div>
            </div>

            {/* Right side - Weather and status */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              {/* LIVE WEATHER DISPLAY */}
              <div className="flex items-center space-x-2 text-xs sm:text-sm bg-blue-50 px-2 py-1 sm:px-3 sm:py-2 rounded-lg">
                {getWeatherIcon(dashboardData.weather.main, dashboardData.weather.description)}
                <span className="font-medium">
                  {dashboardData.weather.city} {dashboardData.weather.temperature}°C
                </span>
                <span className="text-xs text-gray-500 capitalize hidden sm:inline">
                  {dashboardData.weather.description}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-xs sm:text-sm">
                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${dashboardData.device.serverStatus === 1 ? "bg-green-500" : "bg-red-500"}`}></div>
                <span className="text-white">
                  {dashboardData.device.serverStatus === 1 ? "Server Online" : "Server Offline"}
                  <span className="hidden sm:inline"> - Last Updated: {dashboardData.device.lastSeen || "N/A"}</span>
                </span>
              </div>

              <button
                onClick={() => window.location.reload()}
                className="bg-green-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-green-600 transition-colors"
                disabled={loading}
              >
                <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-4">
        {/* STATUS BAR WITH ALERTS - Responsive */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-8 space-y-3 sm:space-y-0">
          {/* Rain Status */}
          <div className="bg-white/20 backdrop-blur-[2px] px-3 py-2 rounded-lg shadow flex items-center gap-2">
            <div>
              <CloudDrizzle className={`h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 ${dashboardData.sensors.isRain ? 'text-blue-700' : 'text-gray-300'}`} />
            </div>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-400">
              {dashboardData.sensors.isRain ? 'Yes' : 'No'}
            </p>
            <p className="text-sm sm:text-base md:text-lg font-medium text-cyan-500">Rain</p>
             
          </div>
          <span className="block py-1 px-3 rounded-full bg-red-500/10 border border-red-500/20  text-red-200 text-sm font-semibold tracking-widest mb-1">
              <p>Note: You have to Connect IoT Device to see the data and functionalities in Dashboard and all other pages.</p>
            </span>

          {/* Alerts */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle
                className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 cursor-pointer hover:text-orange-600"
                onClick={() => setShowAlertsModal(true)}
              />
              <span
                className="text-xs sm:text-sm text-white cursor-pointer hover:underline"
                onClick={() => setShowAlertsModal(true)}
              >
                Total warnings: {dashboardData.alerts.length}
              </span>
              <button
                onClick={() => setDashboardData(prev => ({ ...prev, alerts: [] }))}
                className="bg-green-500 text-white px-2 py-1 sm:px-3 rounded text-xs hover:bg-green-600"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* MAIN DASHBOARD GRID - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-3">
          {/* Water Tank - Responsive */}
          <div className="bg-gray-900/20 backdrop-blur-[2px] border border-yellow-400 py-3 sm:py-4 px-3 sm:px-4 rounded-lg shadow-xl">
            <h3 className="text-base sm:text-lg font-semibold mb-2 text-center text-white">Water Tank</h3>
            <div className="relative w-32 h-40 sm:w-36 sm:h-45 md:w-40 md:h-50 mx-auto mb-4">
              <div className="w-full h-full border-3 sm:border-4 border-green-400 rounded-lg relative overflow-hidden">
                <div
                  className="absolute bottom-0 w-full bg-blue-800/50 backdrop-blur-sm transition-all duration-300"
                  style={{ height: `${dashboardData.sensors.tankLevel * 10}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white font-bold">
                    <div className="text-lg sm:text-xl md:text-2xl">{dashboardData.sensors.tankLevel * 10 || '0'}%</div>
                    <div className="text-xs sm:text-sm">{dashboardData.sensors.tankLevel}L</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Average/Individual Moisture Sensor - Responsive */}
          <div className="bg-gray-900/20 border-orange-400 border backdrop-blur-[3px] p-3 sm:p-4 md:p-6 rounded-lg text-center">
            <div className="w-32 h-20 sm:w-36 sm:h-22 md:w-40 md:h-24 mx-auto mb-3 relative">
              <svg
                className="rotate-[135deg]"
                viewBox="0 0 36 36"
                xmlns="http://www.w3.org/2000/svg"
              >
                {(() => {
                  const radius = 16;
                  const circumference = 2 * Math.PI * radius;

                  let value = 0;
                  switch (selectedMoisture) {
                    case "moisture1":
                      value = dashboardData?.sensors?.moisture1 ?? 0;
                      break;
                    case "moisture2":
                      value = dashboardData?.sensors?.moisture2 ?? 0;
                      break;
                    default:
                      value = dashboardData?.sensors?.averageMoisture ?? 0;
                  }

                  const progress = (value / 100) * circumference * 0.75;

                  return (
                    <>
                      <circle
                        cx="18"
                        cy="18"
                        r={radius}
                        fill="none"
                        className="stroke-current text-green-200 dark:text-neutral-700"
                        strokeWidth="1.5"
                        strokeDasharray={`${circumference * 0.75} ${circumference}`}
                        strokeLinecap="round"
                      ></circle>

                      <circle
                        cx="18"
                        cy="18"
                        r={radius}
                        fill="none"
                        className="stroke-current text-green-500 dark:text-purple-600"
                        strokeWidth="3"
                        strokeDasharray={`${progress} ${circumference}`}
                        strokeLinecap="round"
                        style={{ transition: "stroke-dasharray 0.5s ease" }}
                      ></circle>
                    </>
                  );
                })()}
              </svg>

              <div className="absolute inset-0 flex justify-center items-center mt-13">
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow-[0_0_6px_#10B981]">
                  {selectedMoisture === "average" ? dashboardData?.sensors?.averageMoisture ?? 0 :
                    selectedMoisture === "moisture1" ? (dashboardData?.sensors?.moisture1 ?? 0) :
                      (dashboardData?.sensors?.moisture2 ?? 0)}%
                </span>
              </div>
            </div>

            <div className="flex mt-10 sm:mt-12 md:mt-15 items-center justify-center mb-2">
              <Droplets className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-blue-500" />
              <span className="text-sm sm:text-base md:text-lg font-medium text-white ml-1 ">
                {selectedMoisture === "average" ? "Avg Moisture" :
                  selectedMoisture === "moisture1" ? "Moisture-1" :
                    "Moisture-2"}
              </span>
            </div>

            <div className="mt-3 ">
              <select
                value={selectedMoisture}
                onChange={(e) => setSelectedMoisture(e.target.value)}
                className="bg-gray-800 text-white text-xs sm:text-sm px-2 py-1 sm:px-3 rounded border border-gray-600 focus:outline-none focus:border-blue-400 w-full sm:w-auto cursor-pointer"
              >
                <option value="average">Average - {dashboardData?.sensors?.averageMoisture ?? 0}%</option>
                <option value="moisture1">Sensor 1 - {dashboardData?.sensors?.moisture1 ?? 0}%</option>
                <option value="moisture2">Sensor 2 - {dashboardData?.sensors?.moisture2 ?? 0}% </option>


              </select>
            </div>
          </div>

          {/* Temperature Chart - Responsive */}
          <div className="bg-gray-900/20 border-orange-400 border backdrop-blur-[2px] p-3 sm:p-4 md:p-6 rounded-lg text-center">
            <div className="w-32 h-20 sm:w-36 sm:h-22 md:w-40 md:h-24 mx-auto mb-3 relative">
              <svg
                className="rotate-[135deg]"
                viewBox="0 0 36 36"
                xmlns="http://www.w3.org/2000/svg"
              >
                {(() => {
                  const radius = 16;
                  const circumference = 2 * Math.PI * radius;
                  const value = dashboardData?.sensors?.temperature ?? 0;
                  const progress = (value / 100) * circumference * 0.75;

                  return (
                    <>
                      <circle
                        cx="18"
                        cy="18"
                        r={radius}
                        fill="none"
                        className="stroke-current text-orange-200 dark:text-neutral-700"
                        strokeWidth="1.5"
                        strokeDasharray={`${circumference * 0.75} ${circumference}`}
                        strokeLinecap="round"
                      ></circle>

                      <circle
                        cx="18"
                        cy="18"
                        r={radius}
                        fill="none"
                        className="stroke-current text-orange-500 dark:text-orange-600"
                        strokeWidth="3"
                        strokeDasharray={`${progress} ${circumference}`}
                        strokeLinecap="round"
                        style={{ transition: "stroke-dasharray 0.5s ease" }}
                      ></circle>
                    </>
                  );
                })()}
              </svg>

              <div className="absolute inset-0 flex justify-center items-center mt-13">
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow-[0_0_6px_#F59E0B]">
                  {dashboardData?.sensors?.temperature ?? 0}°C
                </span>
              </div>
            </div>

            <div className="flex mt-10 sm:mt-12 md:mt-15 items-center justify-center mb-2">
              <Thermometer className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-orange-500" />
              <span className="text-sm sm:text-base md:text-lg font-medium text-white ml-1">Temperature</span>
            </div>
          </div>

          {/* Humidity Chart - Responsive */}
          <div className="bg-gray-900/20 border-blue-400 border backdrop-blur-[2px] p-3 sm:p-4 md:p-6 rounded-lg text-center">
            <div className="w-32 h-20 sm:w-36 sm:h-22 md:w-40 md:h-24 mx-auto mb-3 relative">
              <svg
                className="rotate-[135deg]"
                viewBox="0 0 36 36"
                xmlns="http://www.w3.org/2000/svg"
              >
                {(() => {
                  const radius = 16;
                  const circumference = 2 * Math.PI * radius;
                  const value = dashboardData?.sensors?.humidity ?? 0;
                  const progress = (value / 100) * circumference * 0.75;

                  return (
                    <>
                      <circle
                        cx="18"
                        cy="18"
                        r={radius}
                        fill="none"
                        className="stroke-current text-blue-200 dark:text-neutral-700"
                        strokeWidth="1.5"
                        strokeDasharray={`${circumference * 0.75} ${circumference}`}
                        strokeLinecap="round"
                      ></circle>

                      <circle
                        cx="18"
                        cy="18"
                        r={radius}
                        fill="none"
                        className="stroke-current text-blue-500 dark:text-blue-600"
                        strokeWidth="3"
                        strokeDasharray={`${progress} ${circumference}`}
                        strokeLinecap="round"
                        style={{ transition: "stroke-dasharray 0.5s ease" }}
                      ></circle>
                    </>
                  );
                })()}
              </svg>

              <div className="absolute inset-0 flex justify-center items-center mt-13">
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow-[0_0_6px_#3B82F6]">
                  {dashboardData?.sensors?.humidity ?? 0}%
                </span>
              </div>
            </div>

            <div className="flex mt-10 sm:mt-12 md:mt-15 items-center justify-center mb-2">
              <Droplets className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-blue-500" />
              <span className="text-sm sm:text-base md:text-lg font-medium text-white ml-1">Humidity</span>
            </div>
          </div>
        </div>

        {/* ENHANCED PUMP CONTROL SECTION - Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Pump Status - Responsive */}
          <div className="bg-gray-900/20 border-green-400 border p-4 sm:p-6 rounded-lg shadow">
            <p className="text-lg sm:text-xl text-white text-center font-bold mb-4">Status</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="mb-2 mt-2 text-sm sm:text-base md:text-lg text-white font-semibold">Physical Switch</p>
                <div className={`w-6 h-6 sm:w-8 sm:h-8 ${dashboardData.sensors.physicalBtn ? 'bg-green-500' : 'bg-red-500'} rounded-full mx-auto mt-2`}></div>
                <p className="text-xs sm:text-sm text-white font-semibold">{dashboardData.sensors.physicalBtn ? 'On' : 'Off'}</p>
              </div>
              <div className="text-center">
                <p className="text-sm sm:text-base md:text-lg mt-2 font-semibold text-white mb-2">Pump</p>
                <div className={`w-6 h-6 sm:w-8 sm:h-8 ${dashboardData.sensors.pumpStatus ? 'bg-green-500' : 'bg-gray-400'} rounded-full mx-auto mt-2`}></div>
                <p className="text-xs sm:text-sm text-white font-semibold">{dashboardData.sensors.pumpStatus ? 'Running' : 'Stopped'}</p>
              </div>
            </div>
          </div>

          {/* ENHANCED Pump Control with Switch - Responsive */}
          <div className="bg-gray-900/20 border-green-400 border p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-base sm:text-lg font-semibold text-center mb-4 text-white">Pump Control</h3>

            {/* Mode Toggle (Manual / AI Controlled) - Responsive */}
            <div className="flex items-center justify-center mb-6">
              <div
                onClick={() => setMode(mode === "manual" ? "ai" : "manual")}
                className="relative w-48 h-8 sm:w-56 sm:h-10 bg-gray-200 rounded-full cursor-pointer flex items-center"
              >
                <div
                  className={`absolute top-0 left-0 h-8 sm:h-10 w-1/2 rounded-full transition-all duration-300 ${mode === "manual"
                    ? "translate-x-0 bg-blue-600"
                    : "translate-x-full bg-purple-600"
                    }`}
                ></div>

                <div className="w-1/2 text-center z-10 text-xs sm:text-sm font-medium">
                  <span className={mode === "manual" ? "text-black" : "text-black"}>
                    Manual
                  </span>
                </div>
                <div className="w-1/2 text-center font-semibold z-10 text-xs sm:text-sm">
                  <span className={mode === "ai" ? "text-black" : "text-black"}>
                    AI Controlled
                  </span>
                </div>
              </div>
            </div>

            {mode !== 'ai' && (
              <div className="flex items-center justify-center mb-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dashboardData.sensors.pumpControl}
                    onChange={handlePumpToggle}
                    className="sr-only peer"
                    disabled={loading || mode === "ai"}
                  />
                  <div className="relative w-12 h-6 sm:w-15 sm:h-8 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 sm:after:h-8 sm:after:w-8 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
                <span className="ml-3 text-xs sm:text-sm font-medium text-white">
                  {dashboardData.sensors.pumpStatus ? 'Pump ON' : 'Pump OFF'}
                </span>
              </div>
            )}

            {/* Target Moisture for Start - Responsive */}
            {dashboardData.sensors.pumpStatus && (
              <div className="mb-4">
                <label className="block text-xs sm:text-sm font-medium text-white mb-2">
                  Target Soil Moisture
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="20"
                    max="80"
                    value={targetMoisture}
                    onChange={(e) => setTargetMoisture(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-base sm:text-lg font-semibold text-blue-600 min-w-[40px] sm:min-w-[50px]">
                    {targetMoisture}%
                  </span>
                </div>
              </div>
            )}

            <div className="text-center text-white">
              <p className="text-xs sm:text-sm text-white">
                Status: {dashboardData.sensors.pumpStatus ? 'Running' : 'Stopped'}
              </p>
            </div>
          </div>

          {/* Weather & Schedule - Responsive */}
          <div className="space-y-1 md:col-span-2 lg:col-span-1">
            <div className="bg-gray-900/20 border-green-400 border px-4 py-2 sm:px-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                <h3 className="text-base sm:text-lg font-semibold text-white">
                  Upcoming Irrigation
                </h3>
              </div>

              {nextSchedule ? (
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
                 <span className="text-zinc-300">Next:</span>  <span className="text-green-300 ml-1">{formattedDate}</span>
                </p>

              ):(
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
                  No upcoming schedules
                </p>
              )}

              <button
                onClick={handleEdit}
                disabled={!nextSchedule}
                className={`w-full py-2 px-4 rounded-lg text-sm sm:text-base font-medium ${nextSchedule
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-600 text-gray-300 cursor-not-allowed"
                  }`}
              >
                Edit
              </button>
            </div>



            <div className="space-y-0">
              <div className="bg-gray-900/20 border-green-400 border px-4 py-2 sm:px-6 rounded-lg shadow">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-300">Water needed for upcoming irrigation: 5L</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PUMP CONTROL MODALS - Already responsive */}
      <ConfirmationModal
        isOpen={showPumpModal}
        onClose={() => setShowPumpModal(false)}
        onConfirm={handlePumpModalConfirm}
        title="Start Irrigation"
        type="default"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Target Soil Moisture Level
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="20"
                max="80"
                value={targetMoisture}
                onChange={(e) => setTargetMoisture(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-lg font-semibold text-blue-600 min-w-[50px]">
                {targetMoisture}%
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Dry (20%)</span>
              <span>Current: {dashboardData.sensors.averageMoisture}%</span>
              <span>Wet (80%)</span>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              💧 Irrigation will run until soil moisture reaches {targetMoisture}%
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Estimated time: ~{Math.max(5, Math.round((targetMoisture - dashboardData.sensors.averageMoisture) * 0.5))} minutes
            </p>
          </div>
        </div>
      </ConfirmationModal>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleFinalConfirm}
        title={pumpAction === 'start' ? "Confirm Start Pump" : "Confirm Stop Pump"}
        type={pumpAction === 'start' ? "default" : "warning"}
        message={pumpAction === 'start'
          ? `Are you sure you want to start the pump to reach ${targetMoisture}% soil moisture?`
          : "Are you sure you want to stop the pump?"
        }
      />

      {showAlertsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Warnings</h3>
              <button
                onClick={() => setShowAlertsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <ul className="space-y-2">
              {dashboardData.alerts.map((alert, index) => (
                <li
                  key={index}
                  className="text-sm text-orange-800 bg-orange-50 p-2 rounded"
                >
                  {alert}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowAlertsModal(false)}
              className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded text-sm sm:text-base hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
