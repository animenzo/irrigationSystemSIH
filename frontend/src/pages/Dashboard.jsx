import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cloud, Server, Droplets, Thermometer, CloudDrizzle, AlertTriangle, Power, CirclePlay, Calendar, Settings } from "lucide-react";
import { api, farmService, irrigationService,sensorService } from '../services/api';

import { useSchedules } from '../contexts/ScheduleContext';
import { getWeather } from '../services/weatherService';
import { useParams, useNavigate } from 'react-router-dom';
const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 60, damping: 12 } }
};


const translations = {
  en: {
    dashboard: 'Dashboard',
    moisture: 'Moisture',
    temperature: 'Temperature',
    humidity: 'Humidity',
    rain: 'Rain',
    rainDetected: '☔ Rain Detected',
    noRain: '☀️ No Rain',
    rainPaused: 'Irrigation paused - Rain detected',
    weatherRain: 'Local Rain: YES | Forecast: Light Rain',
    weatherClear: 'Local Rain: NO | Forecast: Clear',
    pumpControl: 'Pump Control',
    automatic: 'Automatic',
    manual: 'Manual',
    startPump: 'Start Pump',
    stopPump: 'Stop Pump',
    turnOnPump: 'Turn On Pump',
    turnOffPump: 'Turn Off Pump',
    confirmStart: 'Start irrigation for 15 minutes?',
    pumpActive: 'Pump Active',
    timer: 'Timer',
    status: 'Status',
    running: 'Running',
    stopped: 'Stopped',
    upcomingIrrigation: 'Upcoming Irrigation',
    next: 'Next',
    edit: 'Edit',
    warnings: {
      low_moisture: 'Low soil moisture detected. Consider irrigating soon.',
      low_tank: 'Water tank level is low. Refill required.',
      high_temp: 'High temperature alert. Monitor crop stress.',
      rain_detected: 'Rain detected. Irrigation paused automatically.',
      rain_forecast: 'Rain forecasted. Prepare for potential delays.'
    }
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    moisture: 'मिट्टी की नमी',
    temperature: 'तापमान',
    humidity: 'आर्द्रता',
    rain: 'बारिश',
    rainDetected: '☔ बारिश का पता चला',
    noRain: '☀️ कोई बारिश नहीं',
    rainPaused: 'सिंचाई रोकी गई - बारिश का पता चला',
    weatherRain: 'स्थानीय बारिश: हाँ | पूर्वानुमान: हल्की बारिश',
    weatherClear: 'स्थानीय बारिश: नहीं | पूर्वानुमान: साफ',
    pumpControl: 'पंप नियंत्रण',
    automatic: 'स्वचालित',
    manual: 'मैनुअल',
    startPump: 'पंप शुरू करें',
    stopPump: 'पंप रोकें',
    turnOnPump: 'पंप चालू करें',
    turnOffPump: 'पंप बंद करें',
    confirmStart: '15 मिनट के लिए सिंचाई शुरू करें?',
    pumpActive: 'पंप सक्रिय',
    timer: 'टाइमर',
    status: 'स्थिति',
    running: 'चल रहा है',
    stopped: 'रोका गया',
    upcomingIrrigation: 'आगामी सिंचाई',
    next: 'अगला',
    edit: 'संपादित करें',
    warnings: {
      low_moisture: 'मिट्टी की नमी कम है। जल्दी सिंचाई पर विचार करें।',
      low_tank: 'जल टैंक का स्तर कम है। भरना आवश्यक है।',
      high_temp: 'उच्च तापमान अलर्ट। फसल तनाव की निगरानी करें।',
      rain_detected: 'बारिश का पता चला। सिंचाई स्वचालित रूप से रोकी गई।',
      rain_forecast: 'बारिश का पूर्वानुमान। संभावित देरी के लिए तैयार रहें।'
    }
  },
  gu: {
    dashboard: 'ડેશબોર્ડ',
    moisture: 'માટીની ભેજ',
    temperature: 'તાપમાન',
    humidity: 'આરદ્રતા',
    rain: 'વરસાદ',
    rainDetected: '☔ વરસાદની શોધ',
    noRain: '☀️ વરસાદ નહીં',
    rainPaused: 'સિંચાઈ થંભી - વરસાદની શોધ',
    weatherRain: 'સ્થાનિક વરસાદ: હા | અનુમાન: હળવો વરસાદ',
    weatherClear: 'સ્થાનિક વરસાદ: ના | અનુમાન: સ્પષ્ટ',
    pumpControl: 'પંપ નિયંત્રણ',
    automatic: 'આપોઆપ',
    manual: 'મેન્યુઅલ',
    startPump: 'પંપ શરૂ કરો',
    stopPump: 'પંપ બંધ કરો',
    turnOnPump: 'પંપ ચાલુ કરો',
    turnOffPump: 'પંપ બંધ કરો',
    confirmStart: '15 મિનિટ માટે સિંચાઈ શરૂ કરો?',
    pumpActive: 'પંપ સક્રિય',
    timer: 'ટાઇમર',
    status: 'સ્થિતિ',
    running: 'ચાલુ',
    stopped: 'બંધ',
    upcomingIrrigation: 'આગામી સિંચાઈ',
    next: 'આગલું',
    edit: 'સંપાદિત કરો',
    warnings: {
      low_moisture: 'માટીની ભેજ ઓછી છે. જલ્દી સિંચાઈ વિચારો.',
      low_tank: 'પાણીની ટાંકીનું સ્તર ઓછું છે. ભરવું જરૂરી છે.',
      high_temp: 'ઉચ્ચ તાપમાન અલર્ટ. પાકના તણાવની નિગરાની કરો.',
      rain_detected: 'વરસાદની શોધ. સિંચાઈ આપમેળે રોકાઈ ગઈ.',
      rain_forecast: 'વરસાદની આગાહી. સંભવિત વિલંબ માટે તૈયાર રહો.'
    }
  }
};

export default function Dashboard() {
    const { schedules, updateSchedule, fetchSchedules } = useSchedules();
    const { farmId } = useParams();
    const navigate = useNavigate();
    const [isManual, setIsManual] = useState(false);

    useEffect(() => {
        if (!farmId) {
            navigate('/farms');
        }
    }, [farmId, navigate]);
    const [sensorData, setSensorData] = useState({
        moisture1: 45,
        moisture2: 45,
        moisture: 45,
        temperature: 28,
        humidity: 65,
        isRain: 0,
        physicalBtn: 0,
        pumpStatus: false,
        tankLevel: 75,
        timestamp: new Date().toISOString()
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeWarnings, setActiveWarnings] = useState([]);
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [farmInfo, setFarmInfo] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('loading');
    const [lastUpdate, setLastUpdate] = useState(null);
    const [weather, setWeather] = useState(null);
    const [currentLang, setCurrentLang] = useState('en');
    const [timer, setTimer] = useState(15 * 60); // 15 minutes in seconds


    const CACHE_KEY = `blynkCache_${farmId}`;

    const getCache = () => {
        const cachedStr = localStorage.getItem(CACHE_KEY);
        if (!cachedStr) return null;
        try {
            const { data, ts } = JSON.parse(cachedStr);
            const cacheTime = new Date(ts).getTime();
            const now = Date.now();
            if (now - cacheTime > 24 * 60 * 60 * 1000) {
                localStorage.removeItem(CACHE_KEY);
                return null;
            }
            return { data, timestamp: ts };
        } catch (e) {
            localStorage.removeItem(CACHE_KEY);
            return null;
        }
    };

    const setCache = (data, ts) => {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts }));
    };

    const timeAgo = (ts) => {
        const now = new Date();
        const then = new Date(ts);
        const diffMs = now - then;
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffH = Math.floor(diffMins / 60);
        if (diffH < 24) return `${diffH}h ago`;
        return `${Math.floor(diffH / 24)}d ago`;
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'online': return 'bg-green-500';
            case 'offline': return 'bg-red-500';
            case 'loading': return 'bg-gray-500';
            default: return 'bg-gray-500';
        }
    };

    const fetchSensorData = async () => {
        try {
            const response = await api.get('/blynk/pins');
            const { moisture1, moisture2, temperature, humidity, isRain, physicalBtn, pumpStatus, tankLevel } = response.data;
            const moisture = ((parseFloat(moisture1) || 0) + (parseFloat(moisture2) || 0)) / 2;
            const apiData = {
                moisture1,
                moisture2,
                moisture,
                temperature,
                humidity,
                isRain: parseInt(isRain) || 0,
                physicalBtn: parseInt(physicalBtn) || 0,
                pumpStatus: parseInt(pumpStatus) || 0,
                tankLevel,
                timestamp: new Date().toISOString()
                
            };
            console.log(moisture1, moisture2, temperature, humidity, isRain, physicalBtn, pumpStatus, tankLevel)
            const ts = apiData.timestamp;
            setConnectionStatus('live');
            setLastUpdate(ts);
            setCache(apiData, ts);
            const warnings = [];
            if (apiData.moisture < 30) warnings.push('low_moisture');
            if (apiData.tankLevel < 20) warnings.push('low_tank');
            if (apiData.temperature > 40) warnings.push('high_temp');
            if (apiData.isRain === 1) warnings.push('rain_detected');
            if (weather && weather.hasRainForecast) warnings.push('rain_forecast');
            setActiveWarnings(warnings);
            setSensorData(apiData);
            return apiData;
        } catch (error) {
            console.error('Error fetching sensor data:', error);
            setConnectionStatus('offline');
            // Fallback to cache
            const cached = getCache();
            if (cached) {
                const apiData = { ...cached.data, timestamp: new Date().toISOString() };
                setLastUpdate(apiData.timestamp);
                const warnings = [];
                if (apiData.moisture < 30) warnings.push('low_moisture');
                if (apiData.tankLevel < 20) warnings.push('low_tank');
                if (apiData.temperature > 40) warnings.push('high_temp');
                if (apiData.isRain === 1) warnings.push('rain_detected');
                if (weather && weather.hasRainForecast) warnings.push('rain_forecast');
                setActiveWarnings(warnings);
                setSensorData(apiData);
                return apiData;
            } else {
                // Demo fallback
                const demoData = {
                    moisture1: 45,
                    moisture2: 45,
                    moisture: 45,
                    temperature: 28,
                    humidity: 65,
                    isRain: 0,
                    physicalBtn: 0,
                    pumpStatus: 0,
                    tankLevel: 75,
                    timestamp: new Date().toISOString()
                };
                const ts = demoData.timestamp;
                setLastUpdate(ts);
                const warnings = [];
                if (demoData.moisture < 30) warnings.push('low_moisture');
                if (demoData.tankLevel < 20) warnings.push('low_tank');
                if (demoData.temperature > 40) warnings.push('high_temp');
                if (demoData.isRain === 1) warnings.push('rain_detected');
                if (weather && weather.hasRainForecast) warnings.push('rain_forecast');
                setActiveWarnings(warnings);
                setSensorData(demoData);
                return demoData;
            }
        }
    };

    
    // Add farm info fetch
    useEffect(() => {
        const getFarmInfo = () => {
            const mockFarm = {
                name: "Demo Farm",
                crop: "Wheat",
                size_acres: 5
            };
            setFarmInfo(mockFarm);
        };
        getFarmInfo();
    }, [farmId]);
   
    useEffect(() => {
        if (farmId) {
            fetchSchedules(farmId);
        }
    }, [farmId, fetchSchedules]);
   
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [editForm, setEditForm] = useState({ time: '', duration: '' });
   
    const getUpcomingSchedule = () => {
        if (!schedules.length) return null;
        const now = new Date();
        const upcoming = schedules
            .filter(s => s.status === 'Active')
            .sort((a, b) => new Date(a.nextRun) - new Date(b.nextRun))
            .find(s => new Date(s.nextRun) > now);
        if (!upcoming) return null;
        const date = new Date(upcoming.nextRun);
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toUpperCase();
        return `${formattedDate}, ${formattedTime}`;
    };
   
    const handleEditSchedule = (schedule) => {
        setSelectedSchedule(schedule);
        setEditForm({ time: schedule.time, duration: schedule.duration });
        setShowEditModal(true);
    };
   
    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!selectedSchedule) return;
        try {
            await updateSchedule(selectedSchedule._id, { ...selectedSchedule, ...editForm });
            setShowEditModal(false);
            setSelectedSchedule(null);
            setEditForm({ time: '', duration: '' });
        } catch (error) {
            console.error('Error updating schedule:', error);
        }
    };
   
    const handleScheduleMore = () => {
        navigate('/schedules');
    };
 



    const handlePumpControl = async (status) => {
        if (sensorData.isRain === 1) {
            alert(translations[currentLang].rainPaused);
            return;
        }
        try {
            await api.post('/blynk/setPin', { pin: 'v6', value: status ? 1 : 0 });
            setSensorData(prev => ({ ...prev, pumpStatus: status }));
        } catch (error) {
            console.error('Error controlling pump:', error);
            // Fallback to local state for demo
            setSensorData(prev => ({ ...prev, pumpStatus: status }));
        }
    };

    const handleRefresh = () => {
        fetchSensorData();
    };

    const handleToggleManual = () => {
        setIsManual(prev => !prev);
    };

    useEffect(() => {
        if (farmId) {
            setLastUpdate(sensorData.timestamp);
            const warnings = [];
            if (sensorData.moisture < 30) warnings.push('low_moisture');
            if (sensorData.tankLevel < 20) warnings.push('low_tank');
            if (sensorData.temperature > 40) warnings.push('high_temp');
            if (sensorData.isRain === 1) warnings.push('rain_detected');
            if (weather && weather.hasRainForecast) warnings.push('rain_forecast');
            setActiveWarnings(warnings);
        }
    }, [farmId]);
    
    useEffect(() => {
        const checkConnection = async () => {
            try {
                const response = await api.get('/blynk/check');
                setConnectionStatus(response.data.connected ? 'online' : 'offline');
            } catch (error) {
                console.error('Connection check failed:', error);
                setConnectionStatus('offline');
            }
        };
    
        checkConnection();
    
        const interval = setInterval(checkConnection, 15000); // 15 seconds
    
        return () => clearInterval(interval);
    }, []);
    
    useEffect(() => {
        fetchSensorData();
    
        const interval = setInterval(fetchSensorData, 30000); // 30 seconds
    
        return () => clearInterval(interval);
    }, [farmId]);
    
    useEffect(() => {
        const fetchWeather = async () => {
            const data = await getWeather();
            setWeather(data);
        };
    
        fetchWeather();
    
        const interval = setInterval(fetchWeather, 600000); // 10 minutes
    
        return () => clearInterval(interval);
    }, []);
    
    useEffect(() => {
        const savedLang = localStorage.getItem('preferredLang') || 'en';
        setCurrentLang(savedLang);
    }, []);
    
    useEffect(() => {
        let countdown;
        if (sensorData.pumpStatus && timer > 0) {
            countdown = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            handlePumpControl(false);
            setTimer(15 * 60);
        }
        return () => clearInterval(countdown);
    }, [sensorData.pumpStatus, timer]);


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error && connectionStatus !== 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-red-500">Error: {error}</p>
                    <button
                        onClick={() => {
                            setError(null);
                            handleRefresh();
                        }}
                        className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

     const farmData = {
        name: farmInfo?.name || "Loading...",
        crop: farmInfo?.crop || "Loading...",
        area: farmInfo?.size_acres ? `${farmInfo.size_acres} Acres` : "Loading...",
        nextIrrigation: getUpcomingSchedule() || "No upcoming schedules",
        tank: {
            percent: sensorData?.tankLevel || 0,
            liters: Math.round((sensorData?.tankLevel || 0) * 2)
        },
        soil: sensorData?.moisture || 0,
        temp: sensorData?.temperature || 0,
        tempPercent: ((sensorData?.temperature || 0) / 50) * 100,
        humidity: sensorData?.humidity || 0,
        isRain: sensorData?.isRain || 0,
        warnings: activeWarnings.length,
        manual: isManual,
        pump: sensorData?.pumpStatus || false,
    };

    return (
        <div className="bg-[hsl(var(--background))] min-h-screen font-sans p-6">
            {/* Top Navigation */}
            <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
                <div className="flex gap-4 items-center">
                    <span className="text-2xl font-bold tracking-tight flex items-center">
                        <span className="bg-[hsl(var(--primary))] rounded-lg p-2 mr-2">
                            <CirclePlay className="text-white" size={28} />
                        </span>
                        {translations[currentLang].dashboard}
                    </span>
                    <div className="bg-white rounded-xl px-3 py-1 flex gap-2 items-center text-[hsl(var(--primary))] text-sm font-medium shadow">
                        {farmData.name}
                    </div>
                    <div className="bg-white rounded-xl px-3 py-1 flex gap-2 items-center text-[hsl(var(--primary))] text-sm font-medium shadow">
                        {farmData.crop}
                    </div>
                    <div className="bg-white rounded-xl px-3 py-1 flex gap-2 items-center text-[hsl(var(--primary))] text-sm font-medium shadow">
                        {farmData.area}
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    {/* Weather - hardcoded for now */}
                    <div className="bg-white rounded-xl px-3 py-1 flex gap-2 items-center text-[hsl(var(--info))] text-sm font-medium shadow">
                        <Cloud className="inline mr-1" />
                        <span>{weather ? `${Math.round(weather.temperature)}°C, ${weather.description}` : 'Loading...'}</span>
                    </div>
                    {/* Rain Comparison */}
                    <div className="bg-white rounded-xl px-3 py-1 flex gap-2 items-center text-sm font-medium shadow">
                        <span>{weather ? (farmData.isRain || weather.hasRainForecast ? translations[currentLang].weatherRain : translations[currentLang].weatherClear) : 'Loading...'}</span>
                    </div>
                    {/* Rain Status */}
                    <div className="rain-status bg-white rounded-xl px-3 py-1 flex gap-2 items-center text-sm font-medium shadow">
                        {farmData.isRain ? translations[currentLang].rainDetected : translations[currentLang].noRain}
                        <small className="text-gray-500">Local sensor</small>
                    </div>
                    {/* Server Status */}
                    <div className="bg-white rounded-xl px-3 py-1 flex gap-2 items-center text-sm font-medium shadow">
                        <Server className="inline mr-1" />
                        <span className={`${
                            connectionStatus === 'online' ? 'text-green-600' : 'text-red-600'
                        } font-medium`}>
                            Server {connectionStatus === 'online' ? 'Online' : 'Offline'}
                        </span>
                    </div>
                    <select
                        value={currentLang}
                        onChange={(e) => {
                            const lang = e.target.value;
                            setCurrentLang(lang);
                            localStorage.setItem('preferredLang', lang);
                        }}
                        className="bg-white rounded-xl px-3 py-1 text-sm font-medium shadow border-0 focus:ring-0 cursor-pointer"
                    >
                        <option value="en">EN</option>
                        <option value="hi">हिं</option>
                        <option value="gu">ગુ</option>
                    </select>
                    <Settings size={18} className="ml-1 text-[hsl(var(--primary))]" />
                </div>
            </div>

            {/* Blynk Status Bar */}
            {lastUpdate && (
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white rounded-3xl shadow-sm p-4 flex items-center gap-3 mb-6"
                >
                    <div className={`w-4 h-4 rounded-full ${getStatusColor(connectionStatus)}`}></div>
                    <span className="font-medium">
                        Device {connectionStatus === 'online' ? 'Online' : connectionStatus === 'offline' ? 'Offline' : 'Checking...'}
                    </span>
                    <span className="text-gray-600 ml-2"> - Last Updated: {timeAgo(lastUpdate)}</span>
                    <button
                        onClick={handleRefresh}
                        className="ml-auto px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-lg hover:bg-[hsl(var(--primary))/0.9] transition-colors"
                    >
                        Refresh
                    </button>
                </motion.div>
            )}

            {/* Warning and Water Needed */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white rounded-3xl shadow-sm p-4 flex items-center gap-3 cursor-pointer hover:bg-yellow-50 transition-colors"
                    onClick={() => activeWarnings.length > 0 && setShowWarningModal(true)}
                >
                    <AlertTriangle size={20} className="text-[hsl(var(--warning))] mr-2" />
                    <span className="font-bold mr-2 text-base text-[hsl(var(--foreground))]">
                        Total warnings: {activeWarnings.length}
                    </span>
                    <button
                        className="ml-auto text-[hsl(var(--info))] underline text-sm font-medium focus:outline-none"
                        onClick={(e) => { e.stopPropagation(); setActiveWarnings([]); }}
                    >
                        Clear
                    </button>
                </motion.div>
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white rounded-3xl shadow-sm p-4 flex items-center text-[hsl(var(--info))]"
                >
                    <Droplets size={20} className="mr-2" />
                    Water needed to reach moisture: <span className="ml-2 font-bold">
                        {Math.max(0, Math.round((30 - farmData.soil) * 2))} L
                    </span>
                </motion.div>
            </div>

            {/* Main Stats Section */}
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 mb-6">
                {/* Water Tank */}
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="lg:col-span-2 bg-white rounded-3xl shadow-md p-6 items-center flex flex-col"
                >
                    <h3>Water Tank</h3>
                    <div className="relative w-32 h-32 border-4 rounded-2xl bg-[hsl(var(--background))] overflow-hidden mr-2"
                        style={{ borderColor: "hsl(var(--primary) / 30%)" }}>
                        <motion.div
                            className="absolute bottom-0 left-0 right-0"
                            style={{
                                height: `${farmData.tank.percent}%`,
                                background: 'linear-gradient(180deg, hsl(213,100%,65%) 70%, hsl(213,71%,57%) 100%)',
                                transition: 'height 1s cubic-bezier(0.22,1,0.36,1)'
                            }}
                            initial={{ height: 0 }}
                            animate={{ height: `${farmData.tank.percent}%` }}
                            transition={{ duration: 1 }}
                        >
                            <div className="flex flex-col absolute inset-0 items-center justify-center text-white pointer-events-none">
                                <span className="text-2xl font-bold drop-shadow">{farmData.tank.percent}%</span>
                                <span className="text-lg font-semibold drop-shadow">{farmData.tank.liters}L</span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
        
                {/* Moisture Gauge */}
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white rounded-3xl shadow-md p-6 flex flex-col items-center justify-center gap-2"
                >
                    <Droplets size={32} className="mb-2 text-[hsl(var(--info))]" />
                    <div className="relative">
                        <svg width="64" height="64">
                            <circle cx="32" cy="32" r="28" fill="none" stroke="#E3EFFF" strokeWidth="8" />
                            <circle cx="32" cy="32" r="28" fill="none"
                                stroke="hsl(var(--info))"
                                strokeWidth="8"
                                strokeDasharray={176}
                                strokeDashoffset={176 - 176 * (farmData.soil / 100)}
                                strokeLinecap="round" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center font-semibold text-xl text-[hsl(var(--info))]">
                            {farmData.soil}%
                        </span>
                    </div>
                    <span className="font-semibold text-[hsl(var(--info))]">{translations[currentLang].moisture}</span>
                    <span className="text-xs font-bold text-red-500">{farmData.soil < 30 ? "Water now" : ""}</span>
                    <span className="text-xs text-[hsl(var(--foreground))]">Target 30%</span>
                </motion.div>
        
                {/* Temperature Gauge */}
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white rounded-3xl shadow-md p-6 flex flex-col items-center justify-center gap-2"
                >
                    <Thermometer size={28} className="mb-2 text-[hsl(var(--warning))]" />
                    <div className="relative">
                        <svg width="64" height="64">
                            <circle cx="32" cy="32" r="28" fill="none" stroke="#FFF5E5" strokeWidth="8" />
                            <circle cx="32" cy="32" r="28" fill="none"
                                stroke="hsl(var(--warning))"
                                strokeWidth="8"
                                strokeDasharray={176}
                                strokeDashoffset={176 - 176 * (farmData.tempPercent / 100)}
                                strokeLinecap="round" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center font-semibold text-xl text-[hsl(var(--warning))]">
                            {farmData.temp}°C
                        </span>
                    </div>
                    <span className="font-semibold text-[hsl(var(--warning))]">{translations[currentLang].temperature}</span>
                </motion.div>
        
                {/* Humidity Gauge */}
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white rounded-3xl shadow-md p-6 flex flex-col items-center justify-center gap-2"
                >
                    <CloudDrizzle size={28} className="mb-2 text-[hsl(var(--accent))]" />
                    <div className="relative">
                        <svg width="64" height="64">
                            <circle cx="32" cy="32" r="28" fill="none" stroke="#F0FBEA" strokeWidth="8" />
                            <circle cx="32" cy="32" r="28" fill="none"
                                stroke="hsl(var(--accent))"
                                strokeWidth="8"
                                strokeDasharray={176}
                                strokeDashoffset={176 - 176 * (farmData.humidity / 100)}
                                strokeLinecap="round" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center font-semibold text-xl text-[hsl(var(--accent))]">
                            {farmData.humidity}%
                        </span>
                    </div>
                    <span className="font-semibold text-[hsl(var(--accent))]">{translations[currentLang].humidity}</span>
                </motion.div>
        
                {/* Rain Status Card */}
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white rounded-3xl shadow-md p-6 flex flex-col items-center justify-center gap-2"
                >
                    <CloudDrizzle size={28} className={`mb-2 ${farmData.isRain ? 'text-blue-500' : 'text-green-500'}`} />
                    <div className="relative">
                        <svg width="64" height="64">
                            <circle cx="32" cy="32" r="28" fill="none" stroke="#E3F2FD" strokeWidth="8" />
                            <circle cx="32" cy="32" r="28" fill="none"
                                stroke={farmData.isRain ? '#2196F3' : '#4CAF50'}
                                strokeWidth="8"
                                strokeDasharray={176}
                                strokeDashoffset={176 - 176 * (farmData.isRain ? 100 : 0)}
                                strokeLinecap="round" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center font-semibold text-xl text-[hsl(var(--info))]">
                            {farmData.isRain ? 'Yes' : 'No'}
                        </span>
                    </div>
                    <span className="font-semibold">{translations[currentLang].rain}</span>
                    <span className="text-xs text-gray-500">Local sensor</span>
                </motion.div>
            </div>

            {/* Controls Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Switch Status */}
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white rounded-3xl shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-10"
                >
                    <div className="flex items-center gap-2 flex-col">
                        <span className="flex items-center mb-4">
                            <Power className="mr-2" />Physical Switch
                        </span>
                        <span>Pump {farmData.pump ? 'On' : 'Off'}</span>
                        <span className={`w-5 h-5 rounded-full ${
                            farmData.pump ? "bg-green-500" : "bg-[hsl(var(--critical))]"
                        }`}></span>
                    </div>
        
                    <div className="flex items-center gap-2 flex-col">
                        <span className="flex items-center mb-4">
                            <Power className="mr-2" />Automatic Switch
                        </span>
                        <span>{farmData.isRain ? translations[currentLang].rainPaused : (!isManual ? 'Active' : 'Inactive')}</span>
                        <span className={`w-5 h-5 rounded-full ${
                            farmData.isRain || isManual ? "bg-[hsl(var(--critical))]" : "bg-green-500"
                        }`}></span>
                    </div>
                </motion.div>

                {/* Pump Control */}
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white rounded-3xl shadow-sm p-6 flex flex-col items-center gap-4"
                >
                    <span className="flex items-center mb-2">
                        <CirclePlay className="mr-2 text-[hsl(var(--primary))]" />
                        {translations[currentLang].pumpControl}
                    </span>
                    <div className="w-72 flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-500 ml-2">{translations[currentLang].automatic}</span>
                        <button
                            className="w-32 h-8 rounded-full relative flex items-center transition shadow focus:outline-none"
                            style={{
                                backgroundColor: isManual
                                    ? 'hsl(30, 65%, 47%)'
                                    : 'hsl(213, 74%, 43%)'
                            }}
                            onClick={handleToggleManual}
                            aria-label="Toggle manual/automatic"
                            type="button"
                        >
                            <span
                                className={`
                                    absolute top-1 left-1 w-6 h-6 rounded-full shadow bg-white 
                                    transition-transform duration-300 ${isManual ? "translate-x-12" : ""}
                                `}
                                style={{
                                    transform: isManual ? "translateX(3rem)" : "none"
                                }}
                            />
                        </button>
                        <span className="text-sm font-semibold text-gray-500 mr-2">{translations[currentLang].manual}</span>
                    </div>
                    {isManual && (
                        <div className="space-y-2">
                            <button
                                onClick={() => {
                                    if (sensorData.isRain === 1) {
                                        alert(translations[currentLang].rainPaused);
                                        return;
                                    }
                                    if (confirm(translations[currentLang].confirmStart)) {
                                        handlePumpControl(true);
                                    }
                                }}
                                disabled={farmData.pump || farmData.isRain === 1}
                                className={`px-6 py-3 rounded-lg font-medium transition-colors w-full ${
                                    farmData.pump || farmData.isRain === 1
                                        ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                                        : 'bg-green-500 hover:bg-green-600 text-white'
                                }`}
                            >
                                {farmData.isRain === 1 ? translations[currentLang].rainPaused : translations[currentLang].startPump}
                            </button>
                            {farmData.pump && (
                                <div className="text-center">
                                    <div className="text-sm text-green-600 font-medium">{translations[currentLang].pumpActive}</div>
                                    <div className="text-xs text-gray-500">
                                        {translations[currentLang].timer}: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                                    </div>
                                    <button
                                        onClick={() => handlePumpControl(false)}
                                        className="mt-2 px-4 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                                    >
                                        {translations[currentLang].stopPump}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="text-sm text-gray-500 mt-2">
                        {translations[currentLang].status}: {sensorData.pumpStatus ? translations[currentLang].running : translations[currentLang].stopped}
                    </div>
                </motion.div>

                {/* Upcoming Irrigation */}
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white rounded-3xl shadow-sm p-6 flex flex-col gap-4"
                >
                    <span className="flex items-center mb-2">
                        <Calendar className="mr-2" /> {translations[currentLang].upcomingIrrigation}
                    </span>
                    <div>
                        <span className="font-bold text-lg">{translations[currentLang].next}:</span>
                        <span className="ml-2 font-bold text-[hsl(var(--primary))]">
                            {farmData.nextIrrigation}
                        </span>
                    </div>
                    <button className="ml-1 text-[hsl(var(--info))] underline text-sm font-medium focus:outline-none mt-2">
                        {translations[currentLang].edit}
                    </button>
                </motion.div>
            </div>
        
            {/* Warning Modal */}
            {showWarningModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowWarningModal(false)}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-[hsl(var(--foreground))]">
                                Active Warnings ({activeWarnings.length})
                            </h3>
                            <button
                                onClick={() => setShowWarningModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <ul className="space-y-3">
                            {activeWarnings.map((warning, index) => (
                                <li key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                                    <AlertTriangle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-[hsl(var(--foreground))]">
                                        {translations[currentLang].warnings[warning]}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 pt-4 border-t flex justify-end">
                            <button
                                onClick={() => { setActiveWarnings([]); setShowWarningModal(false); }}
                                className="px-4 py-2 bg-[hsl(var(--warning))] text-white rounded-lg hover:bg-[hsl(var(--warning))/0.9]"
                            >
                                Clear All
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
                </div>
            );
        }