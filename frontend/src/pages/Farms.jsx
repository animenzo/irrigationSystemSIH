import React, { useState, useEffect } from 'react';
import { 
  Plus, MapPin, Calendar, Sprout, Search, 
  Droplets, Ruler, ArrowRight, Activity 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFarms } from '../contexts/FarmContext'; // UNCOMMENT FOR REAL APP

// --- MOCK CONTEXT (FOR PREVIEW ONLY) ---
// const useFarms = () => {
//   const [farms, setFarms] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Simulate API fetch
//     const timer = setTimeout(() => {
//       setFarms([
//         {
//           _id: "1",
//           name: "North Sector Alpha",
//           location: "Udaipur, RJ",
//           current_crop: "Wheat",
//           size_acres: 5,
//           soilType: "Loamy",
//           status: "Active",
//           tankDetails: { type: 'circle', dimensions: { diameter: 20 } },
//           image: "/assets/crops/wheat.png"
//         },
//         {
//           _id: "2",
//           name: "East Orchard",
//           location: "Jaipur, RJ",
//           current_crop: "Corn",
//           size_acres: 12,
//           soilType: "Clay",
//           status: "Active",
//           tankDetails: { type: 'rectangle', dimensions: { length: 15, height: 10 } },
//           image: "/assets/crops/corn.png"
//         },
//         {
//           _id: "3",
//           name: "Greenhouse Beta",
//           location: "Kota, RJ",
//           current_crop: "Tomato",
//           size_acres: 2,
//           soilType: "Red Soil",
//           status: "Maintenance",
//           tankDetails: { type: 'rectangle', dimensions: { length: 8, height: 5 } },
//           image: "/assets/crops/tomato.png"
//         }
//       ]);
//       setLoading(false);
//     }, 1000);
//     return () => clearTimeout(timer);
//   }, []);

//   return { farms, loading, error: null };
// };
// ----------------------------------------

function StatusBadge({ status }) {
  const isActive = status === "Active";
  return (
    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
      isActive 
        ? "bg-green-500/10 text-green-400 border-green-500/20" 
        : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></span>
      {status}
    </span>
  );
}

const FarmCard = ({ farm, navigate }) => {
  return (
    <div 
      onClick={() => navigate(`/dashboard/${farm._id}`)}
      className="group relative bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 rounded-xl overflow-hidden hover:border-green-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.1)] hover:-translate-y-1 cursor-pointer flex flex-col h-full"
    >
      {/* Hover Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-green-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      <div className="p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <div className="p-1.5 rounded bg-zinc-800 text-green-500">
                  <Sprout className="w-4 h-4" />
               </div>
               <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">{farm._id.padStart(4, '#00')}</span>
            </div>
            <h2 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">{farm.name}</h2>
          </div>
          <StatusBadge status={farm.status || "Active"} />
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6 flex-1">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase text-zinc-500 font-bold flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Location
            </span>
            <p className="text-sm text-zinc-300 truncate">{farm.location || 'N/A'}</p>
          </div>
          
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase text-zinc-500 font-bold flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Crop
            </span>
            <p className="text-sm text-zinc-300">{farm.current_crop}</p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase text-zinc-500 font-bold flex items-center gap-1">
              <Ruler className="w-3 h-3" /> Size
            </span>
            <p className="text-sm text-zinc-300">{farm.size_acres} Acres</p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase text-zinc-500 font-bold flex items-center gap-1">
              <Droplets className="w-3 h-3" /> Tank
            </span>
            <p className="text-sm text-zinc-300 truncate">
               {farm.tankDetails?.type === 'circle' 
                 ? `Dia: ${farm.tankDetails.dimensions.diameter}m` 
                 : `${farm.tankDetails?.dimensions?.length || 0}x${farm.tankDetails?.dimensions?.height || 0}m`
               }
            </p>
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-auto pt-4 border-t border-zinc-800 flex items-center justify-between text-xs font-medium text-zinc-500 group-hover:text-green-500 transition-colors">
           <span>View Dashboard</span>
           <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};

export default function Farms() {
  const { farms, loading, error } = useFarms();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 rounded-full border-4 border-zinc-800 border-t-green-500 animate-spin"></div>
           <p className="text-zinc-500 animate-pulse font-mono text-sm">LOADING SECTORS...</p>
        </div>
      </div>
    );
  }

  const filteredFarms = farms.filter(farm => 
    farm.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    farm.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-4 lg:p-8">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.05),transparent_50%)]"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#22c55e 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Farm Management</h1>
            <p className="text-zinc-500 text-sm mt-1">Monitor sectors, crop cycles, and resource allocation.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-green-500 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search farms..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full sm:w-64 bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all placeholder:text-zinc-600"
               />
            </div>
            <button
              onClick={() => navigate("/addfarm")}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Deploy New Farm</span>
            </button>
          </div>
        </div>

        {/* Stats Row (Optional Polish) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
              <span className="text-xs text-zinc-500 uppercase font-bold">Total Area</span>
              <p className="text-2xl font-bold text-white mt-1">19 <span className="text-sm text-zinc-600 font-medium">Acres</span></p>
           </div>
           <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
              <span className="text-xs text-zinc-500 uppercase font-bold">Active Zones</span>
              <p className="text-2xl font-bold text-green-400 mt-1">{farms.filter(f => f.status === 'Active').length}</p>
           </div>
           <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
              <span className="text-xs text-zinc-500 uppercase font-bold">Crops</span>
              <p className="text-2xl font-bold text-blue-400 mt-1">3 <span className="text-sm text-zinc-600 font-medium">Types</span></p>
           </div>
           <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
              <span className="text-xs text-zinc-500 uppercase font-bold">System Health</span>
              <div className="flex items-center gap-2 mt-2">
                 <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                 <span className="text-sm font-medium text-white">Optimal</span>
              </div>
           </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarms.length === 0 ? (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-800">
                 <Sprout className="w-8 h-8 text-zinc-600" />
              </div>
              <h3 className="text-xl font-bold text-zinc-400">No Farms Found</h3>
              <p className="text-zinc-600 mt-1 max-w-xs mx-auto">No agricultural zones match your search or have been added yet.</p>
              <button onClick={() => navigate("/addfarm")} className="mt-6 text-green-500 font-medium hover:underline">Deploy your first farm</button>
            </div>
          ) : (
            <>
              {filteredFarms.map(farm => (
                <FarmCard key={farm._id} farm={farm} navigate={navigate} />
              ))}
              
              {/* "Add New" Card Placeholder */}
              <button 
                onClick={() => navigate("/addfarm")}
                className="group border-2 border-dashed border-zinc-800 hover:border-green-500/30 bg-transparent hover:bg-green-500/5 rounded-xl flex flex-col items-center justify-center min-h-[280px] transition-all duration-300"
              >
                 <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 group-hover:border-green-500 transition-all mb-4">
                    <Plus className="w-6 h-6 text-zinc-500 group-hover:text-green-500" />
                 </div>
                 <span className="font-bold text-zinc-500 group-hover:text-green-400 transition-colors">Register New Sector</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}