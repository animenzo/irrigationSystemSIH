import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useSchedules } from '../contexts/ScheduleContext'; // UNCOMMENT THIS IN YOUR REAL APP
import { 
  Calendar, Clock, Plus, Play, Pause, Trash2, 
  Edit2, Droplets, MapPin, Search
} from 'lucide-react';

// --- TEMPORARY MOCK CONTEXT (DELETE THIS IN REAL APP) ---
// This mock simulates the backend fetch so you can see the UI logic in action here.
const useSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      // Simulate backend delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulating data fetched from backend
      const backendData = [
        {
          _id: "1",
          name: "Morning Irrigation",
          zone: "Zone A - Wheat Field",
          status: "Active",
          time: "06:00",
          duration: 45,
          days: [true, true, true, true, true, true, true],
          nextRun: "Tomorrow, 06:00"
        },
     
      ];
      setSchedules(backendData);
    } catch (err) {
      setError("Failed to fetch schedules");
    } finally {
      setLoading(false);
    }
  };

  const deleteSchedule = async (id) => {
    // Simulate backend delete
    setSchedules(prev => prev.filter(s => s._id !== id));
  };

  return { schedules, loading, error, deleteSchedule, fetchSchedules };
};
// ---------------------------------------------------------

// --- CONSTANTS ---
const dayShorts = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// --- COMPONENTS ---

const StatCard = ({ label, value, subtext, icon: Icon }) => (
  <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 p-4 rounded-xl shadow-lg relative overflow-hidden group">
    <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    <div className="flex items-start justify-between mb-2">
      <div>
        <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
        <div className="text-xs text-zinc-400 font-medium uppercase tracking-wider mt-1">{label}</div>
      </div>
      <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
        {Icon && <Icon className="w-5 h-5" />}
      </div>
    </div>
    {subtext && <div className="text-xs text-zinc-500 border-t border-zinc-800/50 pt-2 mt-2">{subtext}</div>}
  </div>
);

const ScheduleCard = ({ schedule, navigate, onDelete }) => {
  const isActive = schedule.status === "Active";

  return (
    <div className={`group relative bg-zinc-900/40 backdrop-blur-sm border rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isActive ? 'border-zinc-800 hover:border-green-500/50' : 'border-zinc-800 hover:border-zinc-700'}`}>
      
      {/* Active Indicator Bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${isActive ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-yellow-500/50'}`}></div>

      <div className="p-5 pl-7">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors">{schedule.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-3 h-3 text-zinc-500" />
              <span className="text-xs text-zinc-400">{schedule.zone}</span>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
            isActive 
              ? "bg-green-500/10 text-green-400 border-green-500/20" 
              : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
          }`}>
            {schedule.status}
          </span>
        </div>

        {/* Time & Duration */}
        <div className="flex items-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${isActive ? 'text-green-500' : 'text-zinc-600'}`} />
            <span className="text-xl font-mono font-medium text-white">{schedule.time}</span>
          </div>
          <div className="h-4 w-[1px] bg-zinc-800"></div>
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-zinc-300">{schedule.duration} min</span>
          </div>
        </div>

        {/* Days of Week */}
        <div className="flex gap-1.5 mb-5">
          {schedule.days.map((isActiveDay, i) => (
            <div
              key={i}
              className={`w-6 h-6 flex items-center justify-center rounded text-[10px] font-bold transition-all ${
                isActiveDay 
                  ? "bg-green-600 text-white shadow-[0_0_8px_rgba(34,197,94,0.4)]" 
                  : "bg-zinc-800/50 text-zinc-600 border border-zinc-800"
              }`}
            >
              {dayShorts[i]}
            </div>
          ))}
        </div>

        {/* Footer Info & Actions */}
        <div className="flex items-end justify-between border-t border-zinc-800 pt-3 mt-1">
          <div className="text-xs text-zinc-500">
             Next: <span className="text-zinc-300 ml-1">{schedule.nextRun || "Auto-calculated"}</span>
          </div>
          
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
             <button 
                onClick={() => navigate(`/schedules/edit/${schedule._id}`)}
                className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                title="Edit"
             >
               <Edit2 className="w-4 h-4" />
             </button>
             <button 
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this schedule?')) onDelete(schedule._id);
                }}
                className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                title="Delete"
             >
               <Trash2 className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---

export default function Schedules() {
  const { schedules, loading, error, deleteSchedule, fetchSchedules } = useSchedules();
  // Using a simple mock navigate for the preview if router is not present
  const navigate = useNavigate ? useNavigate() : (path) => console.log("Navigate to", path);

  useEffect(() => {
     fetchSchedules();
  }, []);

  // Calculations for stats
  const total = schedules.length;
  const active = schedules.filter(s => s.status === "Active").length;
  const paused = schedules.filter(s => s.status === "Paused").length;
  const dailyMins = schedules
    .filter(s => s.status === "Active")
    .reduce((sum, s) => sum + (s.duration || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 rounded-full border-4 border-zinc-800 border-t-green-500 animate-spin"></div>
           <p className="text-zinc-500 animate-pulse font-mono text-sm">LOADING SCHEDULES...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-green-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900/95 to-black"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#22c55e 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
              Irrigation Schedules
              <span className="px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs font-mono">
                {total} Total
              </span>
            </h1>
            <p className="text-zinc-500 text-sm mt-1">Manage automated irrigation timers and zones.</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Search zones..." 
                  className="bg-zinc-900 border border-zinc-800 rounded-lg py-2 pl-9 pr-4 text-sm text-zinc-300 focus:outline-none focus:border-green-500 w-48"
                />
             </div>
             <button
              onClick={() => navigate("/schedules/create")}
              className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] transition-all flex items-center gap-2 text-sm font-bold"
            >
              <Plus className="w-4 h-4" />
              <span>Create Schedule</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            label="Total Schedules" 
            value={total} 
            icon={Calendar} 
            subtext="All zones included"
          />
          <StatCard 
            label="Active Timers" 
            value={active} 
            icon={Play} 
            subtext="Currently running"
          />
          <StatCard 
            label="Paused" 
            value={paused} 
            icon={Pause} 
            subtext="Inactive zones"
          />
          <StatCard 
            label="Daily Runtime" 
            value={`${Math.floor(dailyMins/60)}h ${dailyMins%60}m`} 
            icon={Droplets} 
            subtext="Total irrigation time"
          />
        </div>

        {/* Schedules Grid */}
        {schedules.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 rounded-xl border border-zinc-800 border-dashed">
             <Clock className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
             <h3 className="text-zinc-400 font-medium">No schedules found</h3>
             <p className="text-zinc-600 text-sm mt-1">Create a new schedule to automate your irrigation.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {schedules.map(s => (
              <ScheduleCard 
                key={s._id} 
                schedule={s} 
                navigate={navigate} 
                onDelete={deleteSchedule} 
              />
            ))}
            
            {/* Add New Placeholder Card */}
            <button 
              onClick={() => navigate("/schedules/create")}
              className="group flex flex-col items-center justify-center min-h-[200px] rounded-xl border-2 border-dashed border-zinc-800 hover:border-green-500/50 hover:bg-green-500/5 transition-all duration-300"
            >
               <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 group-hover:border-green-500/50 transition-all">
                  <Plus className="w-6 h-6 text-zinc-500 group-hover:text-green-500" />
               </div>
               <span className="mt-4 text-sm font-medium text-zinc-500 group-hover:text-green-400">Add New Schedule</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}