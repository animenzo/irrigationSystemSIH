import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Play, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import ReactPlayer from "react-player";
import { motion } from "framer-motion";
import Lottie from "lottie-react";

export default function Home() {
  const [animData, setAnimData] = useState(null);
const style = {
    backgroundImage: 'url("https://unsplash.com/photos/a-green-leaf-with-water-drops-on-it-7GoVyUl4T8o")',
    backgroundSize: 'cover',       // cover the entire area
    backgroundPosition: 'center',  // center the image
    width: '100%',
    height: '100vh',               // full viewport height
  };


  return (
    <div className="relative min-h-screen overflow-x-hidden " >
      {/* Background Video */}
       <div className="absolute inset-0 -z-20">
         <video
        src="/farm-video.webm"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 min-w-screen h-100% object-cover -z-20"
      />
      <div className="absolute inset-0 bg-black/55 -z-10"></div>
      </div>

      {/* Navbar */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-screen-lg mx-auto border-b-[1px] border-zinc-800 justify-between py-2 flex items-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="flex items-center space-x-3"
        >
          <div className="bg-yellow-400 p-2 rounded-md shadow-md">
            <img src="/logo.png" alt="logo" className="h-6 w-6" />
          </div>
          <span className="text-white font-semibold tracking-wide">AgroSmart</span>
        </motion.div>

        <nav className="hidden md:flex space-x-6 text-white font-medium">
          {["HOME", "DASHBOARD", "FARMS", "WEATHER", "SENSORS", "SCHEDULES"].map(
            (item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 * i }}
              >
                <Link to={`/${item.toLowerCase()}`} className="hover:text-yellow-400">
                  {item}
                </Link>
              </motion.div>
            )
          )}
        </nav>

        <div className="flex items-center space-x-3">
          <Link
            to="/login"
            className="px-4 py-2 rounded-full font-medium text-white border border-white hover:bg-yellow-400 hover:text-gray-900 transition"
          >
            LOGIN
          </Link>
          <Link
            to="/signup"
            className="bg-yellow-400 px-4 py-2 rounded-full font-semibold text-gray-900 hover:bg-yellow-500 transition"
          >
            SIGNUP
          </Link>
        </div>
      </motion.header>

      {/* Hero */}
      <main className="relative z-20">
        <section className="min-h-screen flex flex-col lg:flex-row items-center justify-center px-2 md:px-12 lg:px-10 py-20">
          {/* Left: Text */}
          <div className="flex-1 max-w-3xl">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-yellow-400 text-sm md:text-base tracking-widest"
            >
              AGROSMART
            </motion.h3>

            <motion.h1
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7, type: "spring" }}
              className="text-4xl md:text-6xl font-bold text-white leading-tight mt-3"
            >
              SMART FARMING <br /> MADE SIMPLE
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.95 }}
              className="text-gray-200 mt-4 text-lg"
            >
              Manage farms, monitor sensors, track weather, and automate irrigation —
              all in one intuitive dashboard built for modern farmers.
            </motion.p>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="mt-8 flex items-center gap-4"
            >
              <Link
                to="/about"
                className="bg-yellow-400 px-6 py-3 rounded-full font-semibold text-gray-900 hover:bg-yellow-500 transition"
              >
                DISCOVER MORE
              </Link>

              
            </motion.div>
          </div>

          {/* Right: Lottie / placeholder */}
         
        </section>

        {/* How It Works */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className=" py-16 px-6 lg:px-20 text-center bg-white " 
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-6 bg-gray-50 rounded-2xl shadow-sm">
              <img src="/icons/farm.png" alt="farm" className="h-16 mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-2">Add Your Farm</h3>
              <p className="text-gray-600">Create farm profiles and map fields in minutes.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl shadow-sm">
              <img src="/icons/sensor.png" alt="sensor" className="h-16 mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-2">Connect Sensors</h3>
              <p className="text-gray-600">Plug in IoT sensors for soil, moisture and climate.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl shadow-sm">
              <img src="/icons/automation.png" alt="automation" className="h-16 mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-2">Automate Actions</h3>
              <p className="text-gray-600">Schedule irrigation and notifications automatically.</p>
            </div>
          </div>
        </motion.section>

        {/* About */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gray-50 py-16 px-6 lg:px-20 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About AgroSmart</h2>
          <p className="text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed">
            AgroSmart is a next-generation farming platform combining IoT, cloud analytics,
            and automation to simplify farm operations. We give farmers actionable insights,
            water-saving automation and remote monitoring so they can increase yield and
            reduce effort.
          </p>
        </motion.section>

        {/* Technology & Infrastructure */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white py-16 px-6 lg:px-20"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Technology & Infrastructure</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
            <div className="p-6 bg-gray-50 rounded-xl shadow-sm">
              <img src="/icons/iot.png" alt="iot" className="h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">IoT Sensors</h3>
              <p className="text-gray-600">Real-time soil, moisture and environment monitoring with low-power sensors.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl shadow-sm">
              <img src="/icons/cloud.png" alt="cloud" className="h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Cloud Platform</h3>
              <p className="text-gray-600">Secure, scalable cloud storage and analytics accessible from any device.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl shadow-sm">
              <img src="/icons/ai.png" alt="ai" className="h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI & Automation</h3>
              <p className="text-gray-600">ML-driven irrigation recommendations and automation to maximize yield.</p>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="bg-zinc-900 text-gray-300 py-10 px-6 lg:px-20">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-3">AgroSmart</h3>
              <p className="text-gray-400">Smart farming platform helping farmers get more from less.</p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-yellow-400">Home</Link></li>
                <li><Link to="/about" className="hover:text-yellow-400">About</Link></li>
                <li><Link to="/contact" className="hover:text-yellow-400">Contact</Link></li>
                <li><Link to="/dashboard" className="hover:text-yellow-400">Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Contact</h4>
              <p className="text-gray-400">support@agrosmart.com</p>
              <p className="text-gray-400 mt-1">+91 98765 43210</p>

              <div className="flex items-center gap-4 mt-4 text-gray-400">
                <a href="#"><Facebook className="hover:text-yellow-400" /></a>
                <a href="#"><Instagram className="hover:text-yellow-400" /></a>
                <a href="#"><Twitter className="hover:text-yellow-400" /></a>
                <a href="#"><Linkedin className="hover:text-yellow-400" /></a>
              </div>
            </div>
          </div>

          <div className="text-center text-gray-500 mt-8">
            © {new Date().getFullYear()} AgroSmart. All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  );
}
