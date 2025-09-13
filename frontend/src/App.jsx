import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";

import SideBarMenu from "./components/SideBarMenu";
import Farms from "./pages/Farms";
import AddFarm from "./pages/AddFarm";

import { FarmProvider } from "./contexts/FarmContext";
import { ScheduleProvider } from './contexts/ScheduleContext';

import Weather from "./pages/Weather";
import ViewDetails from "./components/ViewDetails";
import Schedules from "./pages/Schedules";
import ScheduleEdit from "./components/ScheduleEdit";
import ScheduleCreate from "./components/ScheduleCreate";
import IrrigationControl from "./pages/IrrigationControl";
import Sensors from "./pages/Sensors";
import AddSensor from "./components/AddSensor";
import SensorDetails from "./components/SensorDetails";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";

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

  const location = useLocation();
  useEffect(() => {
    setSideOpen(window.innerWidth >= 1024);
  }, [location]);

  const isHomePage = location.pathname === "/";

  if (isHomePage) {
    // 👉 Home page should NOT have sidebar
    return (
      <main className="w-full">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    );
  }

  // 👉 All other pages (Dashboard layout)
  return (
    <div className="flex">
      <SideBarMenu isOpen={sideOpen} setIsOpen={setSideOpen} />
      <main className={`flex-1 ${sideOpen ? "ml-1" : ""}`}>
        <Routes>
          <Route path="/dashboard/:farmId?" element={<Dashboard />} />
          <Route path="/farms" element={<Farms />} />
          <Route path="/addfarm" element={<AddFarm />} />
          <Route path="/farms/:id" element={<ViewDetails />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/schedules" element={<Schedules />} />
          <Route path="/sensors" element={<Sensors />} />
          <Route path="/sensors/add" element={<AddSensor />} />
          <Route path="/sensors/:id" element={<SensorDetails />} />
          <Route path="/schedules/create" element={<ScheduleCreate />} />
          <Route path="/schedules/edit/:id" element={<ScheduleEdit />} />
          <Route path="/irrigation" element={<IrrigationControl />} />
        </Routes>
      </main>
    </div>
  );
}


export default function App() {
  return (
    <ErrorBoundary>
     <ScheduleProvider>
     <FarmProvider>
    <Router>
      <Layout />
    </Router>
    </FarmProvider>
    </ScheduleProvider>
    </ErrorBoundary>
  );
}
