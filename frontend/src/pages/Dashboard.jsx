import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cloud, Server, Droplets, Thermometer, CloudDrizzle, AlertTriangle, Power, CirclePlay, Calendar, Settings } from "lucide-react";
import { api } from '../services/api';

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 60, damping: 12 } }
};

const info = [
    { icon: <Cloud className="inline mr-1" />, label: "Cloudy 23°C" },
    { icon: <Server className="inline mr-1" />, label: "Server Online" },
];

export default function Dashboard() {
    const [isManual, setIsManual] = useState(false);
    const [sensorData, setSensorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [warnings, setWarnings] = useState(0);
    
    const farmId = "6512345678901234567890"; // Replace with your actual farm ID

    const fetchSensorData = async () => {
        try {
            const data = await api.getSensorData(farmId);
            setSensorData(data);
            setLoading(false);
            
            // Calculate warnings
            let warningCount = 0;
            if (data.moisture < 30) warningCount++;
            if (data.tankLevel < 20) warningCount++;
            if (data.temperature > 40) warningCount++;
            setWarnings(warningCount);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handlePumpControl = async (status) => {
        try {
            await api.controlPump(status);
            fetchSensorData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleToggleManual = () => {
        setIsManual(prev => !prev);
    };

    useEffect(() => {
        fetchSensorData();
        const interval = setInterval(fetchSensorData, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-red-500">Error: {error}</p>
                    <button 
                        onClick={fetchSensorData}
                        className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const farmData = {
        name: "North Farm",
        crop: "Wheat",
        area: "5 Acres",
        nextIrrigation: "29 Sept, 6:00 AM",
        tank: { 
            percent: sensorData?.tankLevel || 0, 
            liters: Math.round((sensorData?.tankLevel || 0) * 2) 
        },
        soil: sensorData?.moisture || 0,
        temp: sensorData?.temperature || 0,
        tempPercent: ((sensorData?.temperature || 0) / 50) * 100,
        humidity: sensorData?.humidity || 0,
        warnings: warnings,
        manual: isManual,
        pump: sensorData?.pumpStatus || false,
    };

    return (
        <div className="bg-[hsl(var(--background))] min-h-screen font-sans p-6">
            {/* Top Navigation */}
            <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
                <div className="flex gap-4 items-center">
                    <span className="text-2xl font-bold tracking-tight flex items-center">
                        <span className="bg-[hsl(var(--primary))] rounded-lg p-2 mr-2">
                            <CirclePlay className="text-white" size={28} />
                        </span>
                        Dashboard
                    </span>
                    <div className="bg-white rounded-xl px-3 py-1 flex gap-2 items-center text-[hsl(var(--primary))] text-sm font-medium shadow">
                        {farmData.name}
                    </div>
                    <div className="bg-white rounded-xl px-3 py-1 flex gap-2 items-center text-[hsl(var(--primary))] text-sm font-medium shadow">
                        {farmData.crop}
                    </div>
                    <div className="bg-white rounded-xl px-3 py-1 flex gap-2 items-center text-[hsl(var(--primary))] text-sm font-medium shadow">
                        {farmData.area}
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    {info.map((i, idx) => (
                        <div key={idx} className="bg-white rounded-xl px-3 py-1 flex gap-2 items-center text-[hsl(var(--info))] text-sm font-medium shadow">
                            {i.icon}{i.label}
                        </div>
                    ))}
                    <div className="bg-white rounded-xl px-3 py-1 flex gap-2 items-center shadow text-sm">
                        <span className="font-semibold">EN</span>
                    </div>
                    <Settings size={18} className="ml-1 text-[hsl(var(--primary))]" />
                </div>
            </div>

            {/* Warning and Water Needed */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white rounded-3xl shadow-sm p-4 flex items-center gap-3"
                >
                    <AlertTriangle size={20} className="text-[hsl(var(--warning))] mr-2" />
                    <span className="font-bold mr-2 text-base text-[hsl(var(--foreground))]">
                        Total warnings: {farmData.warnings}
                    </span>
                    <button 
                        className="ml-auto text-[hsl(var(--info))] underline text-sm font-medium focus:outline-none"
                        onClick={() => setWarnings(0)}
                    >
                        Clear
                    </button>
                </motion.div>
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white rounded-3xl shadow-sm p-4 flex items-center text-[hsl(var(--info))]"
                >
                    <Droplets size={20} className="mr-2" />
                    Water needed to reach moisture: <span className="ml-2 font-bold">
                        {Math.max(0, Math.round((30 - farmData.soil) * 2))} L
                    </span>
                </motion.div>
            </div>

            {/* Main Stats Section */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
                {/* Water Tank */}
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="lg:col-span-2 bg-white rounded-3xl shadow-md p-6 items-center flex flex-col"
                >
                    <h3>Water Tank</h3>
                    <div className="relative w-32 h-32 border-4 rounded-2xl bg-[hsl(var(--background))] overflow-hidden mr-2"
                        style={{ borderColor: "hsl(var(--primary) / 30%)" }}>
                        <motion.div
                            className="absolute bottom-0 left-0 right-0"
                            style={{
                                height: `${farmData.tank.percent}%`,
                                background: 'linear-gradient(180deg, hsl(213,100%,65%) 70%, hsl(213,71%,57%) 100%)',
                                transition: 'height 1s cubic-bezier(0.22,1,0.36,1)'
                            }}
                            initial={{ height: 0 }}
                            animate={{ height: `${farmData.tank.percent}%` }}
                            transition={{ duration: 1 }}
                        >
                            <div className="flex flex-col absolute inset-0 items-center justify-center text-white pointer-events-none">
                                <span className="text-2xl font-bold drop-shadow">{farmData.tank.percent}%</span>
                                <span className="text-lg font-semibold drop-shadow">{farmData.tank.liters}L</span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Moisture Gauge */}
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white rounded-3xl shadow-md p-6 flex flex-col items-center justify-center gap-2"
                >
                    <Droplets size={32} className="mb-2 text-[hsl(var(--info))]" />
                    <div className="relative">
                        <svg width="64" height="64">
                            <circle cx="32" cy="32" r="28" fill="none" stroke="#E3EFFF" strokeWidth="8" />
                            <circle cx="32" cy="32" r="28" fill="none"
                                stroke="hsl(var(--info))"
                                strokeWidth="8"
                                strokeDasharray={176}
                                strokeDashoffset={176 - 176 * (farmData.soil / 100)}
                                strokeLinecap="round" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center font-semibold text-xl text-[hsl(var(--info))]">
                            {farmData.soil}%
                        </span>
                    </div>
                    <span className="font-semibold text-[hsl(var(--info))]">Moisture</span>
                    <span className="text-xs font-bold text-red-500">{farmData.soil < 30 ? "Water now" : ""}</span>
                    <span className="text-xs text-[hsl(var(--foreground))]">Target 30%</span>
                </motion.div>

                {/* Temperature Gauge */}
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white rounded-3xl shadow-md p-6 flex flex-col items-center justify-center gap-2"
                >
                    <Thermometer size={28} className="mb-2 text-[hsl(var(--warning))]" />
                    <div className="relative">
                        <svg width="64" height="64">
                            <circle cx="32" cy="32" r="28" fill="none" stroke="#FFF5E5" strokeWidth="8" />
                            <circle cx="32" cy="32" r="28" fill="none"
                                stroke="hsl(var(--warning))"
                                strokeWidth="8"
                                strokeDasharray={176}
                                strokeDashoffset={176 - 176 * (farmData.tempPercent / 100)}
                                strokeLinecap="round" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center font-semibold text-xl text-[hsl(var(--warning))]">
                            {farmData.temp}°C
                        </span>
                    </div>
                    <span className="font-semibold text-[hsl(var(--warning))]">Temperature</span>
                </motion.div>

                {/* Humidity Gauge */}
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white rounded-3xl shadow-md p-6 flex flex-col items-center justify-center gap-2"
                >
                    <CloudDrizzle size={28} className="mb-2 text-[hsl(var(--accent))]" />
                    <div className="relative">
                        <svg width="64" height="64">
                            <circle cx="32" cy="32" r="28" fill="none" stroke="#F0FBEA" strokeWidth="8" />
                            <circle cx="32" cy="32" r="28" fill="none"
                                stroke="hsl(var(--accent))"
                                strokeWidth="8"
                                strokeDasharray={176}
                                strokeDashoffset={176 - 176 * (farmData.humidity / 100)}
                                strokeLinecap="round" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center font-semibold text-xl text-[hsl(var(--accent))]">
                            {farmData.humidity}%
                        </span>
                    </div>
                    <span className="font-semibold text-[hsl(var(--accent))]">Humidity</span>
                </motion.div>
            </div>

            {/* Controls Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Switch Status */}
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white rounded-3xl shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-10"
                >
                    <div className="flex items-center gap-2 flex-col">
                        <span className="flex items-center mb-4">
                            <Power className="mr-2" />Physical Switch
                        </span>
                        <span>Pump {farmData.pump ? 'On' : 'Off'}</span>
                        <span className={`w-5 h-5 rounded-full ${
                            farmData.pump ? "bg-green-500" : "bg-[hsl(var(--critical))]"
                        }`}></span>
                    </div>

                    <div className="flex items-center gap-2 flex-col">
                        <span className="flex items-center mb-4">
                            <Power className="mr-2" />Automatic Switch
                        </span>
                        <span>Pump {!isManual ? 'Active' : 'Inactive'}</span>
                        <span className={`w-5 h-5 rounded-full ${
                            !isManual ? "bg-green-500" : "bg-[hsl(var(--critical))]"
                        }`}></span>
                    </div>
                </motion.div>

                {/* Pump Control */}
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white rounded-3xl shadow-sm p-6 flex flex-col items-center gap-4"
                >
                    <span className="flex items-center mb-2">
                        <CirclePlay className="mr-2 text-[hsl(var(--primary))]" />
                        Pump Control
                    </span>
                    <div className="w-72 flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-500 ml-2">Automatic</span>
                        <button
                            className="w-32 h-8 rounded-full relative flex items-center transition shadow focus:outline-none"
                            style={{
                                backgroundColor: isManual
                                    ? 'hsl(30, 65%, 47%)'
                                    : 'hsl(213, 74%, 43%)'
                            }}
                            onClick={handleToggleManual}
                            aria-label="Toggle manual/automatic"
                            type="button"
                        >
                            <span
                                className={`
                                    absolute top-1 left-1 w-6 h-6 rounded-full shadow bg-white 
                                    transition-transform duration-300 ${isManual ? "translate-x-12" : ""}
                                `}
                                style={{
                                    transform: isManual ? "translateX(3rem)" : "none"
                                }}
                            />
                        </button>
                        <span className="text-sm font-semibold text-gray-500 mr-2">Manual</span>
                    </div>
                    {isManual && (
                        <button
                            onClick={() => handlePumpControl(!farmData.pump)}
                            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                                farmData.pump 
                                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                                    : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                        >
                            {farmData.pump ? 'Turn Off Pump' : 'Turn On Pump'}
                        </button>
                    )}
                    <div className="text-sm text-gray-500 mt-2">
                        Status: {farmData.pump ? 'Running' : 'Stopped'}
                    </div>
                </motion.div>

                {/* Upcoming Irrigation */}
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white rounded-3xl shadow-sm p-6 flex flex-col gap-4"
                >
                    <span className="flex items-center mb-2">
                        <Calendar className="mr-2" /> Upcoming Irrigation
                    </span>
                    <div>
                        <span className="font-bold text-lg">Next:</span>
                        <span className="ml-2 font-bold text-[hsl(var(--primary))]">
                            {farmData.nextIrrigation}
                        </span>
                    </div>
                    <button className="ml-1 text-[hsl(var(--info))] underline text-sm font-medium focus:outline-none mt-2">
                        Edit
                    </button>
                </motion.div>
            </div>
        </div>
    );
}