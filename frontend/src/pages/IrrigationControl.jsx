import React, { useState, useEffect } from "react";
import { 
  Droplets, Power, Activity, Zap, 
  MapPin, CloudRain, AlertCircle, RefreshCw 
} from "lucide-react";
import { useFarms } from "../contexts/FarmContext"; // UNCOMMENT THIS IN YOUR REAL APP

// --- TEMPORARY MOCK CONTEXT (DELETE THIS IN REAL APP) ---
// This mock simulates the backend fetch so you can see the UI logic in action here.
// const useFarms = () => {
//   const [farms, setFarms] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Simulate API fetch delay
//     const timer = setTimeout(() => {
//       setFarms([
//         {
//           id: "1",
//           name: "North Sector Alpha",
//           location: "Udaipur, RJ",
//           isActive: true,
//           pumpRunning: true,
//           moisture: 45,
//           flowRate: 12.5, // L/min
//           nextSchedule: "06:00 PM"
//         },
//         {
//           id: "2",
//           name: "East Orchard",
//           location: "Jaipur, RJ",
//           isActive: true,
//           pumpRunning: false,
//           moisture: 62,
//           flowRate: 0,
//           nextSchedule: "Tomorrow 05:00 AM"
//         },
//         {
//           id: "3",
//           name: "Greenhouse Beta",
//           location: "Kota, RJ",
//           isActive: false, // Offline
//           pumpRunning: false,
//           moisture: 0,
//           flowRate: 0,
//           nextSchedule: "Paused"
//         }
//       ]);
//       setLoading(false);
//     }, 800);
//     return () => clearTimeout(timer);
//   }, []);

//   const togglePump = (id) => {
//     setFarms(prev => prev.map(f => 
//       f.id === id ? { ...f, pumpRunning: !f.pumpRunning } : f
//     ));
//   };

//   const toggleAllPumps = (shouldRun) => {
//     setFarms(prev => prev.map(f => ({ ...f, pumpRunning: shouldRun })));
//   };

//   return { farms, loading, togglePump, toggleAllPumps };
// };
// ---------------------------------------------------------

const FarmCard = ({ farm, onTogglePump }) => {
  const isRunning = farm.pumpRunning;

  return (
    <div className={`relative bg-zinc-900/60 backdrop-blur-md border rounded-xl overflow-hidden transition-all duration-300 group ${
      isRunning 
        ? "border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.15)]" 
        : "border-zinc-800 hover:border-zinc-700"
    }`}>
      {/* Status Bar Indicator */}
      <div className={`absolute top-0 left-0 w-full h-1 ${isRunning ? "bg-green-500 animate-pulse" : "bg-zinc-800"}`}></div>

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors">
              {farm.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-zinc-500">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{farm.location}</span>
            </div>
          </div>
          
          <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border ${
            farm.isActive 
              ? "bg-blue-500/10 text-blue-400 border-blue-500/20" 
              : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}>
             {farm.isActive ? 'Online' : 'Offline'}
          </div>
        </div>

        {/* Real-time Metrics (Falling back to defaults if data missing in context) */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-zinc-950/50 rounded-lg p-3 border border-zinc-800/50">
            <span className="text-[10px] uppercase text-zinc-500 font-bold flex items-center gap-1 mb-1">
              <Droplets className="w-3 h-3" /> Soil Moisture
            </span>
            <span className={`text-xl font-mono font-bold ${farm.moisture < 30 ? "text-red-400" : "text-white"}`}>
              {farm.moisture || '--'}%
            </span>
          </div>
          <div className="bg-zinc-950/50 rounded-lg p-3 border border-zinc-800/50">
             <span className="text-[10px] uppercase text-zinc-500 font-bold flex items-center gap-1 mb-1">
              <Activity className="w-3 h-3" /> Flow Rate
            </span>
            <span className={`text-xl font-mono font-bold ${isRunning ? "text-blue-400" : "text-zinc-600"}`}>
              {isRunning ? (farm.flowRate || '--') : 0} <span className="text-xs text-zinc-500 font-normal">L/m</span>
            </span>
          </div>
        </div>

        {/* Control Section */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-zinc-800">
           <div className="text-xs">
              <p className="text-zinc-500 mb-0.5">Next Schedule</p>
              <p className="text-zinc-300 font-medium">{farm.nextSchedule || 'Auto'}</p>
           </div>

           <button
             onClick={() => onTogglePump(farm.id)}
             disabled={!farm.isActive}
             className={`relative overflow-hidden px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all duration-300 ${
               !farm.isActive 
                 ? "bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50"
                 : isRunning
                   ? "bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white"
                   : "bg-green-600 hover:bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]"
             }`}
           >
             <Power className="w-4 h-4" />
             {isRunning ? "STOP PUMP" : "START PUMP"}
           </button>
        </div>
      </div>
    </div>
  );
};

export default function IrrigationControl() {
  const { farms, togglePump, toggleAllPumps, loading } = useFarms();

  const handleToggleAllPumps = () => {
    const areAllRunning = farms.length > 0 && farms.every(f => f.pumpRunning);
    toggleAllPumps(!areAllRunning);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 rounded-full border-4 border-zinc-800 border-t-green-500 animate-spin"></div>
           <p className="text-zinc-500 animate-pulse font-mono text-sm">CONNECTING TO PUMPS...</p>
        </div>
      </div>
    );
  }

  const allRunning = farms.length > 0 && farms.every(f => f.pumpRunning);
  const activePumpsCount = farms.filter(f => f.pumpRunning).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-4 lg:p-8">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.05),transparent_50%)]"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#22c55e 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Irrigation Control
              {activePumpsCount > 0 && (
                <span className="px-2 py-0.5 rounded bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-mono animate-pulse">
                  {activePumpsCount} ACTIVE
                </span>
              )}
            </h1>
            <p className="text-zinc-500 text-sm mt-1">Manual override and zone management for irrigation pumps.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
               onClick={() => window.location.reload()}
               className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleToggleAllPumps}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all ${
                 allRunning 
                 ? "bg-red-600 hover:bg-red-500 text-white shadow-red-900/20" 
                 : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20"
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              {allRunning ? 'EMERGENCY STOP ALL' : 'ACTIVATE ALL ZONES'}
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4 flex items-start gap-3">
           <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
           <div>
              <h4 className="text-sm font-bold text-zinc-200">System Status</h4>
              <p className="text-xs text-zinc-500 mt-1">
                Manual activation will override scheduled automation.
              </p>
           </div>
        </div>

        {/* Grid */}
        {farms.length === 0 ? (
           <div className="text-center py-20 border-2 border-dashed border-zinc-800 rounded-2xl">
              <CloudRain className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <h3 className="text-zinc-400 font-medium">No Zones Configured</h3>
              <p className="text-zinc-600 mt-1">Add a farm to begin controlling irrigation.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farms.map(farm => (
              <FarmCard
                key={farm.id}
                farm={farm}
                onTogglePump={togglePump}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}