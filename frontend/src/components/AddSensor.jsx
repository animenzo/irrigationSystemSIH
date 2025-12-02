import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Cpu, MapPin, Activity, Battery, Signal, 
  ArrowLeft, Save, Hash, CheckCircle2 
} from "lucide-react";

export default function AddSensor() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    zone: "",
    type: "",
    unit: "",
    battery_level: 100,
    signal_strength: 100,
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    // Validate form
    if (!form.name || !form.zone || !form.type) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);
    console.log("Submitting sensor", form);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoading(false);
    // TODO: Save to backend or context
    // alert("Sensor added (mock). Redirecting to sensors list...");
    navigate("/sensors");
  };

  const InputField = ({ label, name, value, onChange, icon: Icon, type = "text", required = false, placeholder, min, max }) => (
    <div className="space-y-1.5 group">
      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1 group-focus-within:text-green-500 transition-colors">
        {label} {required && <span className="text-green-500">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-green-500 transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all hover:border-zinc-700"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 blur-[100px] rounded-full"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#22c55e 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Deploy New Node</h1>
            <p className="text-zinc-500 text-sm">Register a new IoT sensor device to the network.</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-blue-600"></div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Main Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField 
                label="Sensor Name" 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                icon={Cpu} 
                placeholder="e.g. Node-MCU-01" 
                required 
              />
              
              <InputField 
                label="Zone / Location" 
                name="zone" 
                value={form.zone} 
                onChange={handleChange} 
                icon={MapPin} 
                placeholder="e.g. Greenhouse A" 
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField 
                label="Sensor Type" 
                name="type" 
                value={form.type} 
                onChange={handleChange} 
                icon={Activity} 
                placeholder="e.g. Soil Moisture" 
                required 
              />
              
              <InputField 
                label="Measurement Unit" 
                name="unit" 
                value={form.unit} 
                onChange={handleChange} 
                icon={Hash} 
                placeholder="e.g. % or °C" 
              />
            </div>

            {/* Hardware Status Section */}
            <div className="bg-zinc-950/50 rounded-xl p-5 border border-zinc-800/50 space-y-4">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> Initial Diagnostics
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="flex justify-between text-xs font-medium text-zinc-500 mb-2">
                      <span>Battery Charge</span>
                      <span className={form.battery_level > 20 ? "text-green-400" : "text-red-400"}>{form.battery_level}%</span>
                   </label>
                   <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600">
                        <Battery className="w-5 h-5" />
                      </div>
                      <input 
                        type="range" 
                        name="battery_level"
                        min="0" max="100" 
                        value={form.battery_level} 
                        onChange={handleChange}
                        className="w-full h-10 opacity-0 cursor-pointer absolute z-20"
                      />
                      {/* Custom Range Visual */}
                      <div className="w-full bg-zinc-900 h-10 rounded-xl border border-zinc-800 pl-10 pr-3 flex items-center overflow-hidden">
                         <div 
                           className="h-2 rounded-full transition-all duration-300 bg-gradient-to-r from-green-600 to-green-400" 
                           style={{ width: `${form.battery_level}%` }}
                         ></div>
                      </div>
                   </div>
                </div>

                <div>
                   <label className="flex justify-between text-xs font-medium text-zinc-500 mb-2">
                      <span>Signal Strength</span>
                      <span className="text-blue-400">{form.signal_strength}%</span>
                   </label>
                   <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600">
                        <Signal className="w-5 h-5" />
                      </div>
                      <input 
                        type="range" 
                        name="signal_strength"
                        min="0" max="100" 
                        value={form.signal_strength} 
                        onChange={handleChange}
                        className="w-full h-10 opacity-0 cursor-pointer absolute z-20"
                      />
                      {/* Custom Range Visual */}
                      <div className="w-full bg-zinc-900 h-10 rounded-xl border border-zinc-800 pl-10 pr-3 flex items-center overflow-hidden">
                         <div 
                           className="h-2 rounded-full transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-400" 
                           style={{ width: `${form.signal_strength}%` }}
                         ></div>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center gap-4">
               <button 
                 type="button"
                 onClick={() => navigate(-1)}
                 className="flex-1 py-3.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 font-medium transition-all"
               >
                 Cancel
               </button>
               <button 
                 type="submit" 
                 disabled={loading}
                 className="flex-[2] py-3.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
               >
                 {loading ? (
                   <span className="animate-spin w-5 h-5 border-2 border-white/20 border-t-white rounded-full"></span>
                 ) : (
                   <>
                     <Save className="w-5 h-5" />
                     Save Configuration
                   </>
                 )}
               </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}