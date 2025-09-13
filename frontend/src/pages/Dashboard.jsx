// components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Cloud, CloudDrizzle, Sun, CloudSnow, Zap,
  Droplets, Thermometer, Power, Calendar, RefreshCw,
  Play, AlertTriangle, Settings
} from "lucide-react";
import ConfirmationModal from '../components/ConfirmationModal';
import { api } from '../services/api';

const Dashboard = () => {


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
      case 'clear': return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'clouds': return <Cloud className="h-6 w-6 text-gray-500" />;
      case 'rain': case 'drizzle': return <CloudDrizzle className="h-6 w-6 text-blue-500" />;
      case 'snow': return <CloudSnow className="h-6 w-6 text-blue-300" />;
      case 'thunderstorm': return <Zap className="h-6 w-6 text-purple-500" />;
      default: return <Cloud className="h-6 w-6 text-gray-500" />;
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
    <div className="min-h-screen  bg-white backdrop-blur-2xl">
      {/* ENHANCED HEADER WITH REAL WEATHER */}
      <div className="bg-zinc-700/30  backdrop-blur-lg shadow-sm border-b ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center">
                  <img src="/smartyFarm.svg" alt="" />
                </div>
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              </div>
              <div className="flex space-x-3">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center  gap-2"><img className="h-8 w-8 rounded-full" src="/farm.png" alt="" />Demo Farm</span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium items-center  gap-2 flex"><img className="rounded-full h-8 w-8" src="/crop.jpg" alt="" />Wheat</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium gap-2 items-center flex"><img className="h-8 w-8 rounded-full" src="/land.jpg" alt="" />5 Acres</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* LIVE WEATHER DISPLAY */}
              <div className="flex items-center space-x-2 text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg">
                {getWeatherIcon(dashboardData.weather.main, dashboardData.weather.description)}
                <span className="font-medium">
                  {dashboardData.weather.city} {dashboardData.weather.temperature}°C
                </span>
                <span className="text-xs text-gray-500 capitalize">
                  {dashboardData.weather.description}
                </span>
              </div>

        <div className="flex items-center space-x-2 text-sm">
  <div
    className={`w-3 h-3 rounded-full ${
      dashboardData.device.serverStatus === 1 ? "bg-green-500" : "bg-red-500"
    }`}
  ></div>
  <span className="text-gray-600">
    {dashboardData.device.serverStatus === 1
      ? "Blynk Server Online"
      : "Blynk Server Offline"}
    {" - "}
    Last Updated: {dashboardData.device.lastSeen || "N/A"}
  </span>
</div>





              <button
                onClick={() => window.location.reload()}
                className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* STATUS BAR WITH ALERTS */}
        <div className="flex justify-between items-center mb-8">
          {/* <div className="flex items-center space-x-2 text-sm">
            <div className={`w-3 h-3 rounded-full ${dashboardData.device.serverStatus === 1 ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
            <span className="text-gray-600">
              {dashboardData.device.serverStatus === 1 ? 'Server Online' : 'Server Offline'} - Last Updated: {dashboardData.device.lastSeen || 'N/A'}
            </span>
          </div> */}

          <div className="bg-white px-3 rounded-lg shadow flex items-center gap-2">
            <div className="">
              <CloudDrizzle className={`h-10 w-10 ${dashboardData.sensors.isRain ? 'text-blue-500' : 'text-gray-300'}`} />
            </div>
            <p className="text-2xl font-bold text-gray-800 ">
              {dashboardData.sensors.isRain ? 'Yes' : 'No'}
            </p>
            <p className="text-lg font-medium text-gray-600">Rain</p>

          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle
                className="h-5 w-5 text-orange-500 cursor-pointer hover:text-orange-600"
                onClick={() => setShowAlertsModal(true)}
              />
              <span
                className="text-sm text-gray-700 cursor-pointer hover:underline"
                onClick={() => setShowAlertsModal(true)}
              >
                Total warnings: {dashboardData.alerts.length}
              </span>
              <button
                onClick={() => setDashboardData(prev => ({ ...prev, alerts: [] }))}
                className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* MAIN DASHBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-3">
          {/* Water Tank */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Water Tank</h3>
            <div className="relative w-40 h-50 mx-auto mb-4">
              <div className="w-full h-full border-4 border-green-400 rounded-lg relative overflow-hidden">
                <div
                  className="absolute bottom-0 w-full bg-blue-500 transition-all duration-300"
                  style={{ height: `${dashboardData.sensors.tankLevel}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-zinc-600 font-bold">
                    <div className="text-2xl">{dashboardData.sensors.tankLevel}%</div>
                    <div className="text-sm">{dashboardData.sensors.tankLevel}L</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sensor Cards */}
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="w-40 h-40 mx-auto mb-3 relative">
              <svg width="160" height="160" className="transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#E5E7EB"
                  strokeWidth="10"
                  fill="none"
                />
                {/* Progress circle */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#10B981"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 70} // 439.82
                  strokeDashoffset={
                    2 * Math.PI * 70 -
                    (dashboardData.sensors.averageMoisture / 100) * (2 * Math.PI * 70)
                  }
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              {/* Percentage label */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-800">
                  {dashboardData.sensors.averageMoisture}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center mb-2">
              <Droplets className="h-6 w-6 text-blue-500 mr-2" />
              <span className="text-base font-medium text-gray-600">Moisture</span>
            </div>
            <p className="text-sm text-gray-400">
              Target {dashboardData.sensors.targetMoisture}%
            </p>
          </div>

          {/* Temperature Chart */}
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="w-40 h-40 mx-auto mb-3 relative">
              <svg width="160" height="160" className="transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="#E5E7EB" strokeWidth="10" fill="none" />
                <circle
                  cx="80" cy="80" r="70"
                  stroke="#F59E0B" strokeWidth="10" fill="none"
                  strokeDasharray={2 * Math.PI * 70} // ~439.82
                  strokeDashoffset={
                    2 * Math.PI * 70 - (dashboardData.sensors.temperature / 50) * (2 * Math.PI * 70)
                  }
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-800">
                  {dashboardData.sensors.temperature}°C
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center mb-2">
              <Thermometer className="h-6 w-6 text-orange-500 mr-2" />
              <span className="text-base font-medium text-gray-600">Temperature</span>
            </div>
          </div>

          {/* Humidity Chart */}
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="w-40 h-40 mx-auto mb-3 relative">
              <svg width="160" height="160" className="transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="#E5E7EB" strokeWidth="10" fill="none" />
                <circle
                  cx="80" cy="80" r="70"
                  stroke="#3B82F6" strokeWidth="10" fill="none"
                  strokeDasharray={2 * Math.PI * 70}
                  strokeDashoffset={
                    2 * Math.PI * 70 - (dashboardData.sensors.humidity / 100) * (2 * Math.PI * 70)
                  }
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-800">
                  {dashboardData.sensors.humidity}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center mb-2">
              <CloudDrizzle className="h-6 w-6 text-green-500 mr-2" />
              <span className="text-base font-medium text-gray-600">Humidity</span>
            </div>
          </div>

        </div>

        {/* ENHANCED PUMP CONTROL SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Pump Status */}
          <div className="bg-white p-6 rounded-lg shadow">
             <p className="text-xl text-gray-800 text-center font-bold">Status</p>
            <div className="grid grid-cols-2 gap-4 ">
              <div className="text-center ">
                {/* <Power className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Physical Switch</p> */}
                <p className=" mb-2 mt-2 text-lg font-semibold">Physical Switch</p> 
               
                
                <div className={`w-8 h-8 ${dashboardData.sensors.physicalBtn ? 'bg-green-500' : 'bg-red-500'} rounded-full mx-auto mt-2`}></div>
                <p className=" text-sm text-gray-700 font-semibold">{dashboardData.sensors.physicalBtn ? 'On' : 'Off'}</p>
              </div>
              <div className="text-center">
                {/* <Power className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Automatic Switch</p> */}
                <p className="text-lg mt-2 font-semibold text-gray-800 mb-2">Pump</p> 
                
                <div className={`w-8 h-8 ${dashboardData.sensors.pumpStatus ? 'bg-green-500' : 'bg-gray-400'} rounded-full mx-auto mt-2`}></div>
                <p className="text-sm  font-semibold">{dashboardData.sensors.pumpStatus ? 'Running' : 'Stopped'}</p>
              </div>
            </div>
          </div>

          {/* ENHANCED Pump Control with Switch */}
          <div className="bg-white p-6 rounded-lg shadow">
            {/* <div className="flex items-center justify-center mb-4">
              <Power className={`h-8 w-8 ${dashboardData.sensors.pumpStatus ? 'text-green-500' : 'text-gray-400'}`} />
            </div> */}
            <h3 className="text-lg font-semibold text-center mb-4">Pump Control</h3>

            {/* Pump Switch */}
            {/* Mode Toggle Switch */}
            {/* Mode Toggle (Manual / AI Controlled) */}
            <div className="flex items-center justify-center mb-6">
              <div
                onClick={() => setMode(mode === "manual" ? "ai" : "manual")}
                className="relative w-56 h-10 bg-gray-200 rounded-full cursor-pointer flex items-center"
              >
                {/* Sliding Knob */}
                <div
                  className={`absolute top-0 left-0 h-10 w-1/2 rounded-full transition-all duration-300 ${mode === "manual"
                      ? "translate-x-0 bg-blue-600"
                      : "translate-x-full bg-purple-600"
                    }`}
                ></div>

                {/* Labels */}
                <div className="w-1/2 text-center z-10 text-sm font-medium">
                  <span className={mode === "manual" ? "text-white" : "text-gray-700"}>
                    Manual
                  </span>
                </div>
                <div className="w-1/2 text-center z-10 text-sm font-medium">
                  <span className={mode === "ai" ? "text-white" : "text-gray-700"}>
                    AI Controlled
                  </span>
                </div>
              </div>
            </div>


            {mode !== 'ai' && <div className="flex items-center justify-center mb-4" >
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={dashboardData.sensors.pumpControl}
                  onChange={handlePumpToggle}
                  className="sr-only peer"
                  disabled={loading || mode === "ai"} // disable if AI controls it
                />
                <div className="relative w-15 h-8 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute  after:bg-white after:border-gray-300 after:border after:rounded-full after:h-8 after:w-8 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
              <span className="ml-3 text-sm font-medium text-gray-900">
                {dashboardData.sensors.pumpStatus ? 'Pump ON' : 'Pump OFF'}
              </span>
            </div>}

            {/* Target Moisture for Start */}
            {dashboardData.sensors.pumpStatus && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <span className="text-lg font-semibold text-blue-600 min-w-[50px]">
                    {targetMoisture}%
                  </span>
                </div>
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Status: {dashboardData.sensors.pumpStatus ? 'Running' : 'Stopped'}
              </p>
            </div>
          </div>

          {/* Weather & Schedule */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="h-6 w-6 text-gray-400" />
                <h3 className="text-lg font-semibold">Upcoming Irrigation</h3>
              </div>
              <p className="text-2xl font-bold text-green-600 mb-2">Next: 29 Sept, 6:00 AM</p>
              <button className="w-full bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600">
                Edit
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* PUMP CONTROL MODALS */}
      <ConfirmationModal
        isOpen={showPumpModal}
        onClose={() => setShowPumpModal(false)}
        onConfirm={handlePumpModalConfirm}
        title="Start Irrigation"
        type="default"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Warnings</h3>
              <button
                onClick={() => setShowAlertsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="h-6 w-6"
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
              className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )


};

export default Dashboard;
