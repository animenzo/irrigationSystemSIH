import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'; // UNCOMMENT FOR REAL APP
import { 
  Sprout, MapPin, Ruler, Database, 
  ArrowLeft, Save, Loader2, Cylinder, 
  Box, Map as MapIcon, LocateFixed
} from "lucide-react";

// import { useFarms } from '../contexts/FarmContext'; // UNCOMMENT FOR REAL APP

// --- TEMPORARY MOCK CONTEXT (DELETE IN REAL APP) ---
const useFarms = () => {
  const addFarm = async (farm) => {
    console.log("Mock API Call: Adding Farm", farm);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    return true;
  };
  return { addFarm };
};
// ---------------------------------------------------

// --- MOCK MAP COMPONENT (REPLACE WITH REAL GOOGLE MAPS IN PROD) ---
const MockMap = ({ onClick, selectedLocation }) => {
  return (
    <div 
      onClick={(e) => {
        // Simulate lat/lng based on click position for demo
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const mockLat = 20.5937 + (y / 100); 
        const mockLng = 78.9629 + (x / 100);
        
        // Simulate Google Maps event object
        onClick({
          latLng: {
            lat: () => mockLat,
            lng: () => mockLng
          }
        });
      }}
      className="w-full h-full bg-zinc-800 relative cursor-crosshair group overflow-hidden"
    >
      {/* Fake Map Background Pattern */}
      <div className="absolute inset-0 opacity-20" style={{ 
          backgroundImage: 'radial-gradient(#4ade80 1px, transparent 1px)', 
          backgroundSize: '20px 20px' 
      }}></div>
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <p className="text-zinc-500 text-sm font-medium bg-zinc-900/80 px-4 py-2 rounded-full border border-zinc-700">
          Interactive Map Placeholder (Click anywhere to set coordinates)
        </p>
      </div>

      {selectedLocation && (
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-full transition-all duration-300"
          style={{ 
            left: `${((selectedLocation.lng - 78.9629) * 100) % 100 + 50}%`, 
            top: `${((selectedLocation.lat - 20.5937) * 100) % 100 + 50}%` 
          }}
        >
          <MapPin className="w-8 h-8 text-red-500 drop-shadow-lg fill-red-500/20 animate-bounce" />
        </div>
      )}
    </div>
  );
};
// ---------------------------------------------------

const mapContainerStyle = { width: '100%', height: '100%', borderRadius: '0.75rem' };
const center = { lat: 20.5937, lng: 78.9629 };

// Helper Component for styled inputs
const InputField = ({ label, name, type = "text", value, onChange, placeholder, icon: Icon, step, readOnly, className }) => (
  <div className={`space-y-1.5 group ${className}`}>
    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1 group-focus-within:text-green-500 transition-colors">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-green-500 transition-colors">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <input
        name={name}
        type={type}
        step={step}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 ${Icon ? 'pl-10' : 'pl-4'} pr-4 text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all hover:border-zinc-700 ${readOnly ? 'cursor-not-allowed opacity-70' : ''}`}
      />
    </div>
  </div>
);

export default function AddFarm() {
  const navigate = useNavigate();
  const { addFarm } = useFarms();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [form, setForm] = useState({
    farmName: '',
    sizeAcres: '',
    cropName: '',
    tankType: '',
    diameter: '',
    height: '',
    length: '',
    soilType: '',
    location: '',
    pincode: '',
    coordinates: null,
    tankArea: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev, [name]: value
    }));
  };

  const handleTankType = (type) => {
    setForm(prev => ({
      ...prev,
      tankType: type,
      diameter: type === 'circle' ? '' : prev.diameter,
      height: type === 'rectangle' ? '' : prev.height,
      length: type === 'rectangle' ? '' : prev.length
    }));
  };

  const handleMapClick = (event) => {
    // In real app: event.latLng.lat()
    // In mock: event.latLng.lat() (simulated above)
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    // Normalize for mock display if needed, or just use as is
    setSelectedLocation({ lat, lng });
    setForm(prev => ({
      ...prev,
      coordinates: { lat, lng },
      location: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    }));
  };

  // Calculate tank area live (surface area for reference)
  React.useEffect(() => {
    if (form.tankType === 'circle' && form.diameter) {
      const dia = parseFloat(form.diameter);
      if (!isNaN(dia)) setForm(f => ({
        ...f, tankArea: `${(Math.PI * (dia/2) ** 2).toFixed(1)} sq m`
      }));
    } else if (form.tankType === 'rectangle' && form.height && form.length) {
      const h = parseFloat(form.height);
      const l = parseFloat(form.length);
      if (!isNaN(h) && !isNaN(l)) setForm(f => ({
        ...f, tankArea: `${(h * l).toFixed(1)} sq m`
      }));
    } else {
      setForm(f => ({ ...f, tankArea: '' }));
    }
  }, [form.tankType, form.diameter, form.height, form.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.farmName) return alert('Farm name required');
    if (!form.sizeAcres) return alert('Farm size in acres required');
    if (!form.cropName) return alert('Select a crop');
    if (!form.tankType) return alert('Select a tank type');
    if (!form.coordinates) return alert('Please select a location on the map');
    if (form.pincode && !/^\d{6}$/.test(form.pincode)) return alert('Pincode must be 6 digits');
    const sizeAcresNum = parseFloat(form.sizeAcres);
    if (isNaN(sizeAcresNum) || sizeAcresNum <= 0) return alert('Valid farm size in acres required');

    setIsSubmitting(true);

    const newFarm = {
      name: form.farmName,
      size_acres: sizeAcresNum,
      current_crop: form.cropName,
      location: form.location,
      coordinates: form.coordinates,
      soilType: form.soilType,
      pincode: form.pincode,
      tankDetails: {
        type: form.tankType,
        dimensions:
          form.tankType === 'circle'
            ? { diameter: parseFloat(form.diameter) || 0 }
            : {
                length: parseFloat(form.length) || 0,
                height: parseFloat(form.height) || 0,
              },
      },
    };

    try {
      await addFarm(newFarm);        // ✅ wait for API call to finish
      navigate('/farms');
    } catch (error) {
      console.error('Failed to add farm:', error);
      alert(error.message || 'Failed to add farm. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 blur-[100px] rounded-full"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#22c55e 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      </div>

      <div className="w-full max-w-4xl relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Register New Sector</h1>
            <p className="text-zinc-500 text-sm">Configure parameters for a new agricultural zone.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-8 relative overflow-hidden">
           {/* Top accent line */}
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-blue-600"></div>

           {/* Section 1: Basic Details */}
           <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <div className="p-1.5 bg-green-500/10 rounded text-green-500"><Sprout className="w-4 h-4"/></div>
                Farm Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <InputField 
                    label="Farm Name"
                    name="farmName"
                    value={form.farmName}
                    onChange={handleChange}
                    placeholder="e.g. North Sector Alpha"
                 />
                 <InputField 
                    label="Total Size (Acres)"
                    name="sizeAcres"
                    type="number"
                    step="0.01"
                    value={form.sizeAcres}
                    onChange={handleChange}
                    placeholder="e.g. 5.5"
                    icon={Ruler}
                 />
                 <div className="space-y-1.5 group">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1 group-focus-within:text-green-500 transition-colors">
                      Current Crop
                    </label>
                    <div className="relative">
                       <select
                        name="cropName"
                        value={form.cropName}
                        onChange={handleChange}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-zinc-200 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 appearance-none cursor-pointer hover:border-zinc-700 transition-all"
                      >
                        <option value="">Select crop type...</option>
                        <option value="Wheat">Wheat</option>
                        <option value="Rice">Rice</option>
                        <option value="Maize">Maize</option>
                        <option value="Rabi">Rabi</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Section 2: Water Storage */}
           <div className="space-y-4 pt-4 border-t border-zinc-800/50">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <div className="p-1.5 bg-blue-500/10 rounded text-blue-500"><Database className="w-4 h-4"/></div>
                Water Storage Configuration
              </h3>
              
              <div className="bg-zinc-950/50 rounded-xl p-4 border border-zinc-800/50">
                 <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 block">Tank Geometry</label>
                 <div className="flex gap-4 mb-6">
                    <label className={`flex-1 relative cursor-pointer group`}>
                       <input type="radio" name="tankType" checked={form.tankType === "circle"} onChange={() => handleTankType("circle")} className="sr-only peer" />
                       <div className="h-full p-4 rounded-xl border-2 border-zinc-800 peer-checked:border-green-500 peer-checked:bg-green-500/5 transition-all flex flex-col items-center justify-center gap-2 hover:border-zinc-700">
                          <Cylinder className="w-8 h-8 text-zinc-600 peer-checked:text-green-500" />
                          <span className="text-sm font-medium text-zinc-400 peer-checked:text-white">Cylindrical</span>
                       </div>
                    </label>
                    <label className={`flex-1 relative cursor-pointer group`}>
                       <input type="radio" name="tankType" checked={form.tankType === "rectangle"} onChange={() => handleTankType("rectangle")} className="sr-only peer" />
                       <div className="h-full p-4 rounded-xl border-2 border-zinc-800 peer-checked:border-green-500 peer-checked:bg-green-500/5 transition-all flex flex-col items-center justify-center gap-2 hover:border-zinc-700">
                          <Box className="w-8 h-8 text-zinc-600 peer-checked:text-green-500" />
                          <span className="text-sm font-medium text-zinc-400 peer-checked:text-white">Rectangular</span>
                       </div>
                    </label>
                 </div>

                 {form.tankType && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
                       {form.tankType === "circle" ? (
                          <InputField 
                            label="Diameter (m)"
                            name="diameter"
                            value={form.diameter}
                            onChange={handleChange}
                            placeholder="0.00"
                          />
                       ) : (
                          <>
                             <InputField 
                                label="Height (m)"
                                name="height"
                                value={form.height}
                                onChange={handleChange}
                                placeholder="0.00"
                             />
                             <InputField 
                                label="Length (m)"
                                name="length"
                                value={form.length}
                                onChange={handleChange}
                                placeholder="0.00"
                             />
                          </>
                       )}
                       <div className="space-y-1.5">
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Surface Area</label>
                          <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-zinc-400">
                             {form.tankArea || '---'}
                          </div>
                       </div>
                    </div>
                 )}
              </div>
           </div>

           {/* Section 3: Location */}
           <div className="space-y-4 pt-4 border-t border-zinc-800/50">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <div className="p-1.5 bg-orange-500/10 rounded text-orange-500"><MapIcon className="w-4 h-4"/></div>
                Geographic Data
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                 <InputField 
                    label="Soil Composition"
                    name="soilType"
                    value={form.soilType}
                    onChange={handleChange}
                    placeholder="e.g. Clay Loam"
                 />
                 <InputField 
                    label="Area Pincode"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="e.g. 313001"
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1 flex justify-between">
                    <span>Farm Coordinates</span>
                    {form.location ? (
                       <span className="text-green-500 flex items-center gap-1"><LocateFixed className="w-3 h-3"/> Location Locked</span>
                    ) : (
                       <span className="text-orange-500 flex items-center gap-1"><MapPin className="w-3 h-3"/> Select on Map</span>
                    )}
                 </label>
                 
                 <div className="w-full h-[300px] rounded-xl overflow-hidden border border-zinc-800 relative group">
                    {/* Mock Map Replacement */}
                    <MockMap onClick={handleMapClick} selectedLocation={selectedLocation} />
                 </div>

                 <div className="flex gap-2 items-center mt-2">
                    <InputField 
                       label="Selected Coordinates"
                       name="location"
                       value={form.location}
                       readOnly={true}
                       placeholder="Lat, Long"
                       className="flex-1"
                    />
                 </div>
              </div>
           </div>

           {/* Submit */}
           <div className="pt-6">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-lg shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                   <>
                     <Loader2 className="w-6 h-6 animate-spin" />
                     Registering Sector...
                   </>
                ) : (
                   <>
                     <Save className="w-5 h-5" />
                     Confirm & Deploy Farm
                   </>
                )}
              </button>
           </div>

        </form>
      </div>
    </div>
  );
}