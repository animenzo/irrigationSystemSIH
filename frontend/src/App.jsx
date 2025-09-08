import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import AddFarm from "./pages/AddFarm";
import SideBarMenu from "./components/SideBarMenu";

function Layout() {
  const [sideOpen, setSideOpen] = useState(window.innerWidth >= 1024);

  // Update sidebar state on window resize for responsiveness
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setSideOpen(true);
      } else {
        setSideOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Optionally close sidebar on route change for mobile devices
  const location = useLocation();
  useEffect(() => {
    setSideOpen(window.innerWidth >= 1024); 
  }, [location]);

  return (
    <div className="flex">
      <SideBarMenu isOpen={sideOpen} setIsOpen={setSideOpen} />
      <main className={`flex-1 ${sideOpen ? 'ml-10' : ''} `}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/addFarm" element={<AddFarm />} />
          {/* Add other routes */}
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
