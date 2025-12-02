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
import Login from "./components/Home/Login";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";
import Settings from "./pages/Settings";



  const CustomCursor = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const manageMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      // Check if hovering over clickable element
      const target = e.target;
      const isClickable = target.closest('a') || target.closest('button') || target.closest('.cursor-target');
      setIsHovered(!!isClickable);
    };

    window.addEventListener("mousemove", manageMouseMove);
    return () => window.removeEventListener("mousemove", manageMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none z-[90] mix-blend-difference"
      style={{
        x: mouseX,
        y: mouseY,
        translateX: "-50%",
        translateY: "-50%"
      }}
      animate={{
        scale: isHovered ? 4 : 1,
      }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    />
  );
};

const Preloader = ({ onComplete }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center text-white"
      initial={{ y: 0 }}
      exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
    >
      <div className="text-[15vw] font-black font-display tabular-nums leading-none">
        {count}%
      </div>
      <div className="absolute bottom-10 left-10 text-xs font-mono uppercase text-red-500 animate-pulse">
        System Initializing...
      </div>
    </motion.div>
  );
};

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

   const noSidebarRoutes = ["/", "/login"]; // add /signup here later if you have it
  const isNoSidebar = noSidebarRoutes.includes(location.pathname);

  if (isNoSidebar) {
    // 👉 Home page should NOT have sidebar
    return (
      <main className="w-full">
        <Routes>
          <Route path="/" element={<Home />} />
           <Route path="/login" element={<Login />} />
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
          <Route path="/settings" element={<Settings />} />

        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  const [showPreloader, setShowPreloader] = useState(true);

  return (
    <ErrorBoundary>
      <ScheduleProvider>
        <FarmProvider>
          {/* Global custom cursor */}
          {/* <CustomCursor /> */}

          {/* Preloader overlay with exit animation */}
          <AnimatePresence>
            {showPreloader && (
              <Preloader onComplete={() => setShowPreloader(false)} />
            )}
          </AnimatePresence>

          {/* Main App */}
          <Router>
            <Layout />
          </Router>
        </FarmProvider>
      </ScheduleProvider>
    </ErrorBoundary>
  );
}
