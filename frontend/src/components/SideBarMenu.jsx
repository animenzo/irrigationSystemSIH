// Sidebar.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu as MenuIcon, X, Home, Layers, Droplets,
  Thermometer, CloudDrizzle, Calendar, Settings, LogOut, CirclePlay
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const sidebarVariants = {
  open: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 350, damping: 30 } },
  closed: { x: -260, opacity: 0, transition: { type: "spring", stiffness: 350, damping: 40 } }
};

export default function SideBarMenu({ isOpen, setIsOpen }) {
  const navigate = useNavigate();

  // Navigation (with "to" for navigation, onClick for logout)
  const NAV = [
    
    { icon: Home, label: "Dashboard", to: "/dashboard" },
    { icon: Layers, label: "Farms", to: "/farms" },
    { icon: Droplets, label: "Irrigation", to: "/irrigation" },
    { icon: Thermometer, label: "Sensors", to: "/sensors" },
    { icon: CloudDrizzle, label: "Weather", to: "/weather" },
    { icon: Calendar, label: "Schedules", to: "/schedules" },
    { icon: Settings, label: "Settings", to: "/settings" },
    { icon: LogOut, label: "Logout", onClick: handleLogout }
  ];

  // Actual logout function
  function handleLogout() {
    // Your logout logic here (clear auth, redirect, etc.)
    localStorage.removeItem("authToken");
    navigate("/login");
  }

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="sidebarOverlay"
            className="fixed inset-0 z-30 bg-black/30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className="fixed z-40 top-0 left-0 h-full w-60 bg-white shadow-lg flex flex-col transition lg:static lg:block"
        style={{ minHeight: "110vh" }}
      >
        <div className="flex items-center justify-between p-5 border-b">
          <span className="text-xl font-bold text-[hsl(var(--primary))] flex items-center">
            <img src="/smartyFarm.svg" alt="logo" className="h-10 w-10" />
            AgroSmart
          </span>
          <button className="lg:hidden" onClick={() => setIsOpen(false)}>
            <X />
          </button>
        </div>
        <nav className="flex-1 pt-2">
          <ul className="flex flex-col">
            {NAV.map(({ icon: Icon, label, to, onClick }) => (
              <li key={label}>
                {to ? (
                  <Link
                    to={to}
                    className="flex items-center px-7 py-3 hover:bg-[hsl(var(--primary)/.08)] transition rounded-lg text-gray-700 font-medium group"
                    onClick={() => setIsOpen(false)} // closes sidebar on nav in mobile
                  >
                    <Icon className="w-5 h-5 mr-4 text-[hsl(var(--primary))] group-hover:text-green-800 transition" />
                    {label}
                  </Link>
                ) : (
                  <button
                    onClick={() => { onClick(); setIsOpen(false); }} // logout closes sidebar
                    className="flex items-center px-7 py-3 hover:bg-[hsl(var(--primary)/.08)] transition rounded-lg text-gray-700 font-medium group w-full text-left"
                  >
                    <Icon className="w-5 h-5 mr-4 text-[hsl(var(--primary))] group-hover:text-green-800 transition" />
                    {label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 text-xs text-gray-400 border-t">&copy; 2025 AgroSmart</div>
      </motion.aside>
      {/* Hamburger (mobile only, only shown when menu is closed) */}
      {!isOpen && (
        <button
          className="fixed z-50 top-5 right-5 bg-white rounded-full shadow p-2 lg:hidden"
          onClick={() => setIsOpen(o => !o)}
          aria-label="open sidebar"
        >
          <MenuIcon className="w-6 h-6 text-white" />
        </button>
      )}
    </>
  );
}
