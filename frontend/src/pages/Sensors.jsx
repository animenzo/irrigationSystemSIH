import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, Wifi, Battery, Activity, Thermometer, 
  Droplets, MapPin, Signal, Clock, ArrowRight,
  Cpu
} from "lucide-react";

// Mock sensor data
const sensorsMock = [
  {
    id: 1,
    name: "Soil Node Alpha",
    zone: "North Sector",
    type: "soil_moisture",
    value: 65,
    unit: "%",
    battery_level: 78,
    signal_strength: 96,
    status: "online",
    last_update: "2m ago",
  },
  {
    id: 2,
    name: "Env Monitor Beta",
    zone: "Greenhouse B",
    type: "temperature",
    value: 29,
    unit: "°C",
    battery_level: 45,
    signal_strength: 62,
    status: "warning",
    last_update: "15m ago",
  },
  {
    id: 3,
    name: "Flow Meter Main",
    zone: "Pump Station",
    type: "flow",
    value: 120,
    unit: "L/m",
    battery_level: 92,
    signal_strength: 88,
    status: "online",
    last_update: "30s ago",
  },
];

const CircularProgress = ({ value, max = 100, size = 100, strokeWidth = 8, color = "#22c55e", children }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value, max);
  const offset = circumference - (circumference * progress) / max;
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track */}
        <circle
          className="text-zinc-800"
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress */}
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-100">
        {children}
      </div>
    </div>
  );
};

const SensorCard = ({ sensor, navigate }) => {
  const isWarning = sensor.status === "warning" || sensor.status === "offline";
  const statusColor = isWarning ? "text-orange-500" : "text-green-500";
  const borderColor = isWarning ? "border-orange-500/30" : "border-zinc-800 hover:border-green-500/50";
  
  // Determine icon based on type
  const Icon = sensor.type === 'temperature' ? Thermometer : 
               sensor.type === 'soil_moisture' ? Droplets : Activity;

  return (
    <div 
      onClick={() => navigate(`/sensors/${sensor.id}`)}
      className={`relative bg-zinc-900/60 backdrop-blur-md border ${borderColor} rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group`}
    >
      {/* Top Row: Name & Status */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors">
            {sensor.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 text-zinc-500 text-xs">
            <MapPin className="w-3 h-3" />
            <span>{sensor.zone}</span>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full bg-zinc-950 border border-zinc-800 flex items-center gap-1.5 ${statusColor}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isWarning ? 'bg-orange-500' : 'bg-green-500 animate-pulse'}`}></span>
          <span className="text-[10px] uppercase font-bold tracking-wider">{sensor.status}</span>
        </div>
      </div>

      {/* Main Visual: Circular Progress */}
      <div className="flex justify-center mb-6">
        <CircularProgress 
          value={sensor.value} 
          max={sensor.type === 'temperature' ? 50 : 100} 
          size={120} 
          strokeWidth={10}
          color={isWarning ? "#f97316" : "#22c55e"}
        >
          <Icon className={`w-6 h-6 mb-1 ${statusColor}`} />
          <div className="text-2xl font-bold font-mono tracking-tighter">
            {sensor.value}<span className="text-sm text-zinc-500 ml-0.5">{sensor.unit}</span>
          </div>
        </CircularProgress>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-zinc-950/50 rounded-lg p-2.5 border border-zinc-800 flex items-center justify-between">
           <div className="flex items-center gap-2 text-zinc-500">
             <Battery className="w-4 h-4" />
             <span className="text-xs font-medium">Battery</span>
           </div>
           <span className={`text-sm font-bold ${sensor.battery_level < 20 ? 'text-red-500' : 'text-zinc-300'}`}>
             {sensor.battery_level}%
           </span>
        </div>
        <div className="bg-zinc-950/50 rounded-lg p-2.5 border border-zinc-800 flex items-center justify-between">
           <div className="flex items-center gap-2 text-zinc-500">
             <Signal className="w-4 h-4" />
             <span className="text-xs font-medium">Signal</span>
           </div>
           <span className="text-sm font-bold text-zinc-300">
             {sensor.signal_strength}%
           </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-800 text-xs text-zinc-500">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          <span>Updated {sensor.last_update}</span>
        </div>
        <div className="flex items-center gap-1 group-hover:text-green-500 transition-colors font-medium">
          Details <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};

export default function Sensors() {
  const navigate = useNavigate();
  const [sensors, setSensors] = useState(sensorsMock);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-4 lg:p-8">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,rgba(34,197,94,0.05),transparent_50%)]"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#22c55e 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Sensor Network
              <span className="px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs font-mono">
                {sensors.length} Nodes
              </span>
            </h1>
            <p className="text-zinc-500 text-sm mt-1">Real-time telemetry from deployed field units.</p>
          </div>
          <span className="block py-1 px-3 rounded-full bg-red-500/10 border border-red-500/20  text-red-200 text-sm font-semibold tracking-widest mb-1">
              <p>Note: This section is under development.</p>
            </span>
          <button 
            onClick={() => navigate("/sensors/add")}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] transition-all group"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            <span>Deploy New Sensor</span>
          </button>
        </div>

        {/* Sensor Grid */}
        {sensors.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-800">
               <Cpu className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-xl font-bold text-zinc-400">No Sensors Active</h3>
            <p className="text-zinc-600 mt-1 max-w-xs mx-auto">Deploy a sensor node to start collecting environmental data.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sensors.map(s => (
              <SensorCard 
                key={s.id} 
                sensor={s} 
                navigate={navigate} 
              />
            ))}
            
            {/* Quick Add Card */}
            <button 
              onClick={() => navigate("/sensors/add")}
              className="group border-2 border-dashed border-zinc-800 hover:border-green-500/30 bg-transparent hover:bg-green-500/5 rounded-xl flex flex-col items-center justify-center min-h-[300px] transition-all duration-300"
            >
               <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 group-hover:border-green-500 transition-all mb-4">
                  <Plus className="w-6 h-6 text-zinc-500 group-hover:text-green-500" />
               </div>
               <span className="font-bold text-zinc-500 group-hover:text-green-400 transition-colors">Add Device</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}