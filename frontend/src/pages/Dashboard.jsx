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
  sensors: {}, weather: {}, device: {}, alerts: []
});

  
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
      const action = pumpAction === 'start';
      const moisture = pumpAction === 'start' ? targetMoisture : null;
      
      await api.post('/blynk/pump/control', {
        action,
        targetMoisture: moisture,
        farmId: 'demo-farm-id'  // Dummy for demo
      });
      
      setShowConfirmModal(false);
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
    <div className="min-h-screen bg-gray-50">
      {/* ENHANCED HEADER WITH REAL WEATHER */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              </div>
              <div className="flex space-x-3">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">Demo Farm</span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">Wheat</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">5 Acres</span>
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
  <div className={`w-2 h-2 rounded-full ${
    dashboardData.device.status === 'online' ? 'bg-green-500' : 'bg-red-500'
  }`}></div>
  <span className="text-gray-600">
    {dashboardData.device.status === 'online' ? 'Server Online' : 'Server Offline'}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* STATUS BAR WITH ALERTS */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2 text-sm">
            <div className={`w-3 h-3 rounded-full ${
              dashboardData.device.status === 'online' ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className="text-gray-600">
              {dashboardData.device.status === 'online' ? 'Server Online' : 'Server Offline'} - Last Updated: {dashboardData.device.lastSeen}
            </span>
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Water Tank */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Water Tank</h3>
            <div className="relative w-32 h-40 mx-auto mb-4">
              <div className="w-full h-full border-4 border-green-400 rounded-lg relative overflow-hidden">
                <div 
                  className="absolute bottom-0 w-full bg-blue-500 transition-all duration-300"
                  style={{ height: `${dashboardData.sensors.tankLevel}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white font-bold">
                    <div className="text-2xl">{dashboardData.sensors.tankLevel}%</div>
                    <div className="text-sm">150L</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sensor Cards */}
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="w-24 h-24 mx-auto mb-3 relative">
              <svg width="96" height="96" className="transform -rotate-90">
                <circle cx="48" cy="48" r="45" stroke="#E5E7EB" strokeWidth="6" fill="none" />
                <circle
                  cx="48" cy="48" r="45" stroke="#10B981" strokeWidth="6" fill="none"
                  strokeDasharray={283} strokeDashoffset={283 - (dashboardData.sensors.averageMoisture / 100 * 283)}
                  strokeLinecap="round" className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-800">{dashboardData.sensors.averageMoisture}%</span>
              </div>
            </div>
            <div className="flex items-center justify-center mb-2">
              <Droplets className="h-5 w-5 text-blue-500 mr-1" />
              <span className="text-sm font-medium text-gray-600">Moisture</span>
            </div>
            <p className="text-xs text-gray-400">Target {dashboardData.sensors.targetMoisture}%</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="w-24 h-24 mx-auto mb-3 relative">
              <svg width="96" height="96" className="transform -rotate-90">
                <circle cx="48" cy="48" r="45" stroke="#E5E7EB" strokeWidth="6" fill="none" />
                <circle
                  cx="48" cy="48" r="45" stroke="#F59E0B" strokeWidth="6" fill="none"
                  strokeDasharray={283} strokeDashoffset={283 - (dashboardData.sensors.temperature / 50 * 283)}
                  strokeLinecap="round" className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-800">{dashboardData.sensors.temperature}°C</span>
              </div>
            </div>
            <div className="flex items-center justify-center mb-2">
              <Thermometer className="h-5 w-5 text-orange-500 mr-1" />
              <span className="text-sm font-medium text-gray-600">Temperature</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="w-24 h-24 mx-auto mb-3 relative">
              <svg width="96" height="96" className="transform -rotate-90">
                <circle cx="48" cy="48" r="45" stroke="#E5E7EB" strokeWidth="6" fill="none" />
                <circle
                  cx="48" cy="48" r="45" stroke="#3B82F6" strokeWidth="6" fill="none"
                  strokeDasharray={283} strokeDashoffset={283 - (dashboardData.sensors.humidity / 100 * 283)}
                  strokeLinecap="round" className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-800">{dashboardData.sensors.humidity}%</span>
              </div>
            </div>
            <div className="flex items-center justify-center mb-2">
              <CloudDrizzle className="h-5 w-5 text-green-500 mr-1" />
              <span className="text-sm font-medium text-gray-600">Humidity</span>
            </div>
          </div>
        </div>

        {/* ENHANCED PUMP CONTROL SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pump Status */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <Power className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Physical Switch</p>
                <p className="text-lg font-semibold">Pump {dashboardData.sensors.physicalBtn ? 'On' : 'Off'}</p>
                <div className={`w-4 h-4 ${dashboardData.sensors.physicalBtn ? 'bg-green-500' : 'bg-red-500'} rounded-full mx-auto mt-2`}></div>
              </div>
              <div className="text-center">
                <Power className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Automatic Switch</p>
                <p className="text-lg font-semibold">{dashboardData.sensors.pumpStatus ? 'Running' : 'Stopped'}</p>
                <div className={`w-4 h-4 ${dashboardData.sensors.pumpStatus ? 'bg-green-500' : 'bg-gray-400'} rounded-full mx-auto mt-2`}></div>
              </div>
            </div>
          </div>

          {/* ENHANCED Pump Control with Switch */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-center mb-4">
              <Power className={`h-8 w-8 ${dashboardData.sensors.pumpStatus ? 'text-green-500' : 'text-gray-400'}`} />
            </div>
            <h3 className="text-lg font-semibold text-center mb-4">Pump Control</h3>
            
            {/* Pump Switch */}
            <div className="flex items-center justify-center mb-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={dashboardData.sensors.pumpControl}
                  onChange={handlePumpToggle}
                  className="sr-only peer"
                  disabled={loading}
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
              <span className="ml-3 text-sm font-medium text-gray-900">
                {dashboardData.sensors.pumpStatus ? 'Pump ON' : 'Pump OFF'}
              </span>
            </div>
            
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

            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="flex items-center justify-center mb-4">
                <CloudDrizzle className={`h-12 w-12 ${dashboardData.sensors.isRain ? 'text-blue-500' : 'text-gray-300'}`} />
              </div>
              <p className="text-3xl font-bold text-gray-800 mb-2">
                {dashboardData.sensors.isRain ? 'Yes' : 'No'}
              </p>
              <p className="text-sm font-medium text-gray-600">Rain</p>
              <p className="text-xs text-gray-400 mt-1">Local sensor</p>
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
    </div>
  );

  // Alerts Modal
  if (showAlertsModal && dashboardData.alerts.length > 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Warnings</h3>
            <button
              onClick={() => setShowAlertsModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <ul className="space-y-2">
            {dashboardData.alerts.map((alert, index) => (
              <li key={index} className="text-sm text-orange-800 bg-orange-50 p-2 rounded">
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
    );
  }
};

export default Dashboard;
