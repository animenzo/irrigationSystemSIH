import React, { useState, useEffect } from "react";
import {
  User, Mail, Phone, MapPin, Save, Shield, 
  Bell, Smartphone, Cpu, LogOut, ChevronRight,
  Camera, Check, AlertCircle, ArrowLeft
} from "lucide-react";

// --- MOCK API & HOOKS ---

const useSettings = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulate API fetch
    const fetchUserData = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      setUser({
        profile: {
          firstName: "Arjun",
          lastName: "Verma",
          email: "arjun.verma@smartfarm.com",
          phone: "+91 98765 43210",
          location: "Punjab, India",
          farmName: "Green Acres Wheat Farm",
          avatarUrl: "/farmer-avatar.jpg" // Placeholder logic
        },
        preferences: {
          notifications: {
            email: true,
            sms: true,
            push: false,
            alerts: true
          },
          units: "metric", // metric vs imperial
          theme: "dark"
        },
        hardware: {
          calibrationDate: "2024-03-15",
          pumpThreshold: 30, // %
          sensorInterval: 15, // minutes
          firmwareVersion: "v2.4.1"
        }
      });
      setLoading(false);
    };

    fetchUserData();
  }, []);

  return { loading, user, setUser };
};

// --- COMPONENTS ---

const SectionCard = ({ title, description, children, icon: Icon }) => (
  <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-xl overflow-hidden shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="p-6 border-b border-zinc-800 flex items-start gap-4">
      <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
        {Icon && <Icon className="w-6 h-6" />}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
        {description && <p className="text-sm text-zinc-500 mt-1">{description}</p>}
      </div>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const InputGroup = ({ label, value, onChange, type = "text", icon: Icon, disabled = false }) => (
  <div className="space-y-2">
    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider ml-1">{label}</label>
    <div className="relative group">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-green-500 transition-colors">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 px-4 ${Icon ? 'pl-10' : ''} text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
      />
    </div>
  </div>
);

const Toggle = ({ label, checked, onChange, description }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex-1 pr-4">
      <p className="text-sm font-medium text-zinc-200">{label}</p>
      {description && <p className="text-xs text-zinc-500 mt-0.5">{description}</p>}
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
      <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600 peer-checked:after:bg-white"></div>
    </label>
  </div>
);

// --- MAIN PAGE ---

const Settings = () => {
  const { loading, user, setUser } = useSettings();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API save
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setSaveMessage("Settings saved successfully");
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const menuItems = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'hardware', label: 'Hardware Config', icon: Cpu },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 rounded-full border-4 border-zinc-800 border-t-green-500 animate-spin"></div>
           <p className="text-zinc-500 animate-pulse font-mono text-sm">LOADING CONFIG...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-green-500/30 pb-20">
      {/* Background Ambience */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900/95 to-black"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#22c55e 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/50 backdrop-blur-lg border-b border-zinc-800 mb-8">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <button className="p-2 -ml-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
               <ArrowLeft className="w-5 h-5" />
             </button>
             <h1 className="text-xl font-bold text-white">Settings</h1>
           </div>
           
           <div className="flex items-center gap-4">
              <span className="hidden sm:inline-block text-xs font-mono text-zinc-500">v2.4.0-stable</span>
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 border border-green-500/30 font-bold text-xs">
                {user.profile.firstName[0]}{user.profile.lastName[0]}
              </div>
           </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Sidebar Navigation */}
        <div className="md:col-span-3 lg:col-span-3 space-y-6">
           <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-2 sticky top-24">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg mb-1 transition-all duration-200 group ${
                    activeTab === item.id 
                    ? 'bg-zinc-800 text-white shadow-lg border border-zinc-700' 
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-green-500' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {activeTab === item.id && <ChevronRight className="w-4 h-4 text-zinc-500" />}
                </button>
              ))}
              
              <div className="my-2 border-t border-zinc-800/50 mx-2"></div>
              
              <button className="w-full flex items-center gap-3 p-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
           </div>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-9 lg:col-span-9 space-y-6">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <SectionCard title="Personal Information" description="Manage your farm identity and contact details." icon={User}>
               <div className="flex flex-col sm:flex-row gap-8 mb-8 items-center sm:items-start">
                  {/* Avatar Upload */}
                  <div className="relative group cursor-pointer">
                    <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-dashed border-zinc-600 flex items-center justify-center overflow-hidden group-hover:border-green-500 transition-colors">
                        {/* Placeholder for actual image */}
                        <User className="w-10 h-10 text-zinc-600" />
                    </div>
                    <div className="absolute bottom-0 right-0 p-1.5 bg-green-600 rounded-full text-white shadow-lg border border-zinc-900 group-hover:scale-110 transition-transform">
                      <Camera className="w-3 h-3" />
                    </div>
                  </div>

                  <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <InputGroup 
                        label="First Name" 
                        value={user.profile.firstName} 
                        onChange={(e) => setUser({...user, profile: {...user.profile, firstName: e.target.value}})}
                     />
                     <InputGroup 
                        label="Last Name" 
                        value={user.profile.lastName} 
                        onChange={(e) => setUser({...user, profile: {...user.profile, lastName: e.target.value}})}
                     />
                     <div className="sm:col-span-2">
                        <InputGroup 
                          label="Farm Name" 
                          icon={Smartphone}
                          value={user.profile.farmName} 
                          onChange={(e) => setUser({...user, profile: {...user.profile, farmName: e.target.value}})}
                        />
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-zinc-800">
                  <InputGroup 
                    label="Email Address" 
                    icon={Mail}
                    type="email"
                    value={user.profile.email} 
                    onChange={(e) => setUser({...user, profile: {...user.profile, email: e.target.value}})}
                  />
                  <InputGroup 
                    label="Phone Number" 
                    icon={Phone}
                    type="tel"
                    value={user.profile.phone} 
                    onChange={(e) => setUser({...user, profile: {...user.profile, phone: e.target.value}})}
                  />
                  <div className="sm:col-span-2">
                    <InputGroup 
                      label="Location / Region" 
                      icon={MapPin}
                      value={user.profile.location} 
                      onChange={(e) => setUser({...user, profile: {...user.profile, location: e.target.value}})}
                    />
                  </div>
               </div>
            </SectionCard>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <SectionCard title="Notification Preferences" description="Choose how you want to be alerted about farm status." icon={Bell}>
               <div className="space-y-2">
                  <Toggle 
                    label="Email Notifications" 
                    description="Receive weekly summaries and major alerts via email."
                    checked={user.preferences.notifications.email}
                    onChange={() => setUser({...user, preferences: {...user.preferences, notifications: {...user.preferences.notifications, email: !user.preferences.notifications.email}}})}
                  />
                  <div className="border-b border-zinc-800/50"></div>
                  <Toggle 
                    label="SMS Alerts" 
                    description="Critical warnings (e.g., pump failure, extreme heat) sent to your phone."
                    checked={user.preferences.notifications.sms}
                    onChange={() => setUser({...user, preferences: {...user.preferences, notifications: {...user.preferences.notifications, sms: !user.preferences.notifications.sms}}})}
                  />
                  <div className="border-b border-zinc-800/50"></div>
                  <Toggle 
                    label="System Popups" 
                    description="Show dashboard popups while you are using the app."
                    checked={user.preferences.notifications.alerts}
                    onChange={() => setUser({...user, preferences: {...user.preferences, notifications: {...user.preferences.notifications, alerts: !user.preferences.notifications.alerts}}})}
                  />
               </div>
            </SectionCard>
          )}

          {/* HARDWARE TAB */}
          {activeTab === 'hardware' && (
            <SectionCard title="Hardware Configuration" description="Calibrate sensors and adjust automation thresholds." icon={Cpu}>
               <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800 mb-6 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">System Status</h4>
                    <p className="text-xs text-zinc-500 mt-1">Firmware: {user.hardware.firmwareVersion}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs font-medium text-green-500">Connected</span>
                  </div>
               </div>

               <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                       <label className="text-sm font-medium text-zinc-300">Pump Auto-Start Threshold</label>
                       <span className="text-sm font-bold text-green-500">{user.hardware.pumpThreshold}% Moisture</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="90" 
                      value={user.hardware.pumpThreshold} 
                      onChange={(e) => setUser({...user, hardware: {...user.hardware, pumpThreshold: parseInt(e.target.value)}})}
                      className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                    />
                    <p className="text-xs text-zinc-500 mt-2">The pump will automatically turn ON when soil moisture drops below this value (if AI mode is enabled).</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg hover:border-zinc-600 transition-colors cursor-pointer group">
                        <h5 className="text-sm font-bold text-white mb-1">Recalibrate Sensors</h5>
                        <p className="text-xs text-zinc-500 mb-3">Last done: {user.hardware.calibrationDate}</p>
                        <button className="text-xs bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded border border-zinc-700 group-hover:bg-green-600 group-hover:text-white group-hover:border-green-500 transition-all">Start Wizard</button>
                     </div>
                     <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg hover:border-zinc-600 transition-colors cursor-pointer group">
                        <h5 className="text-sm font-bold text-white mb-1">Check for Updates</h5>
                        <p className="text-xs text-zinc-500 mb-3">Current: {user.hardware.firmwareVersion}</p>
                        <button className="text-xs bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded border border-zinc-700 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all">Check Now</button>
                     </div>
                  </div>
               </div>
            </SectionCard>
          )}

           {/* SECURITY TAB */}
           {activeTab === 'security' && (
            <SectionCard title="Security & Login" description="Protect your account and data." icon={Shield}>
               <div className="space-y-6">
                 <div className="bg-orange-900/10 border border-orange-500/20 rounded-lg p-4">
                    <div className="flex gap-3">
                       <AlertCircle className="w-5 h-5 text-orange-500 shrink-0" />
                       <div>
                         <h4 className="text-sm font-bold text-orange-200">Two-Factor Authentication</h4>
                         <p className="text-xs text-orange-400/70 mt-1">Recommended for higher security. Enable 2FA to protect farm controls.</p>
                       </div>
                    </div>
                    <button className="mt-3 text-xs bg-orange-900/40 text-orange-200 px-3 py-1.5 rounded border border-orange-500/30 hover:bg-orange-500 hover:text-white transition-all">Enable 2FA</button>
                 </div>

                 <InputGroup 
                    label="Current Password" 
                    type="password"
                    value="********"
                    disabled={true}
                 />
                 
                 <div className="flex justify-end">
                    <button className="text-sm text-green-500 hover:text-green-400 hover:underline">Change Password</button>
                 </div>
               </div>
            </SectionCard>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-end gap-4 pt-4">
             {saveMessage && (
               <div className="flex items-center gap-2 text-green-500 text-sm animate-in fade-in slide-in-from-right-4">
                 <Check className="w-4 h-4" /> {saveMessage}
               </div>
             )}
             <button className="px-6 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
               Discard
             </button>
             <button 
               onClick={handleSave}
               disabled={isSaving}
               className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-green-600 hover:bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
             >
               {isSaving ? (
                 <>
                   <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                 </>
               ) : (
                 <>
                   <Save className="w-4 h-4" /> Save Changes
                 </>
               )}
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;