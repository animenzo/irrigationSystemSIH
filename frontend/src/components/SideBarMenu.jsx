import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu as MenuIcon, X, Home, Layers, Droplets,
  Thermometer, CloudDrizzle, Calendar, Settings, LogOut,
  Sprout
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const sidebarVariants = {
  open: { 
    x: 0, 
    opacity: 1, 
    transition: { type: "spring", stiffness: 300, damping: 30 } 
  },
  closed: { 
    x: "-100%", 
    opacity: 0, 
    transition: { type: "spring", stiffness: 300, damping: 30 } 
  }
};

export default function SideBarMenu({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation Items
  const NAV = [
    { icon: Home, label: "Dashboard", to: "/dashboard" },
    { icon: Layers, label: "Farms & Zones", to: "/farms" },
    { icon: Droplets, label: "Irrigation", to: "/irrigation" },
    { icon: Thermometer, label: "Sensors", to: "/sensors" },
    { icon: CloudDrizzle, label: "Weather", to: "/weather" },
    { icon: Calendar, label: "Schedules", to: "/schedules" },
    { icon: Settings, label: "Settings", to: "/settings" },
  ];

  function handleLogout() {
    // Clear auth token and redirect
    localStorage.removeItem("authToken");
    navigate("/login");
  }

  // Helper to check active state
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="sidebarOverlay"
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
       
      {/* Sidebar Container */}
      <motion.aside
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-zinc-950 border-r border-zinc-800 flex flex-col transition-transform lg:translate-x-0 lg:static lg:h-screen shadow-2xl lg:shadow-none`}
      >
        {/* Background Ambience */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-32 bg-green-500/5 blur-3xl"></div>
             <div className="absolute bottom-0 right-0 w-full h-32 bg-blue-500/5 blur-3xl"></div>
        </div>

        {/* Logo Header */}
        <div className="relative flex items-center justify-between p-6 border-b border-zinc-800/50">
          <Link to="/dashboard" className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
            <div className="relative w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-green-500/50 transition-colors shadow-[0_0_15px_rgba(0,0,0,0.5)]">
               {/* Fallback Icon if Image fails */}
               <Sprout className="w-6 h-6 text-green-500" /> 
               {/* <img src="/smartyFarm.svg" alt="logo" className="h-6 w-6 absolute" /> */}
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white tracking-tight leading-none group-hover:text-green-400 transition-colors">
                Smart<span className="text-green-500">Kheti</span>
              </span>
              
            </div>
          </Link>
          <button 
            className="lg:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors" 
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="relative flex-1 px-4 py-6 overflow-y-auto custom-scrollbar space-y-1">
          <div className="text-xs font-bold text-zinc-600 uppercase tracking-wider mb-4 px-4">Menu</div>
          
          <ul className="space-y-1.5">
            {NAV.map(({ icon: Icon, label, to }) => {
              const active = isActive(to);
              return (
                <li key={label}>
                  <Link
                    to={to}
                    onClick={() => setIsOpen(false)}
                    className={`relative flex items-center px-4 py-3 rounded-xl transition-all duration-200 group overflow-hidden ${
                      active 
                      ? "bg-zinc-900 text-white shadow-[0_0_20px_rgba(34,197,94,0.1)] border border-green-500/20" 
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 border border-transparent"
                    }`}
                  >
                    {/* Active Indicator Line */}
                    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-green-500 rounded-r-full shadow-[0_0_10px_#22c55e]"></div>}
                    
                    <Icon className={`w-5 h-5 mr-3 transition-colors ${
                      active 
                      ? "text-green-400" 
                      : "text-zinc-500 group-hover:text-zinc-300"
                    }`} />
                    <span className="font-medium text-sm">{label}</span>
                    
                    {/* Subtle glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/0 to-green-500/0 group-hover:via-green-500/5 transition-all duration-500"></div>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="my-6 border-t border-zinc-800/50 mx-2"></div>
          
          <div className="text-xs font-bold text-zinc-600 uppercase tracking-wider mb-4 px-4">Account</div>
          <ul>
            <li>
              <button
                onClick={() => { handleLogout(); setIsOpen(false); }}
                className="w-full flex items-center px-4 py-3 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all duration-200 group"
              >
                <LogOut className="w-5 h-5 mr-3 text-zinc-500 group-hover:text-red-500 transition-colors" />
                <span className="font-medium text-sm">Logout</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Footer User Profile Snippet */}
        <div className="relative p-4 border-t border-zinc-800/50 bg-zinc-900/30">
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-green-500 to-blue-600 p-[1px]">
                <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center text-xs font-bold text-white">
                  RK
                </div>
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-medium text-white truncate">Arjun Verma</p>
               <p className="text-xs text-zinc-500 truncate">Arjun@smartKheti.com</p>
             </div>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Hamburger Button */}
      {!isOpen && (
        <button
          className="fixed z-40 top-4 left-4 bg-zinc-900/80 backdrop-blur-md border border-zinc-700 text-white rounded-lg p-2.5 shadow-lg lg:hidden hover:bg-zinc-800 transition-colors"
          onClick={() => setIsOpen(true)}
          aria-label="open sidebar"
        >
          <MenuIcon className="w-5 h-5" />
        </button>
      )}
    </>
  );
}