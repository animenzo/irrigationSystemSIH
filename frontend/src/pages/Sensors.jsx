import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Mock sensor data - must be declared or imported
const sensorsMock = [
  {
    id: 1,
    name: "Soil Moisture Sensor 1",
    zone: "Field A",
    type: "soil_moisture",
    value: 65,
    unit: "%",
    battery_level: 78,
    signal_strength: 96,
    status: "online",
    last_update: "2025-09-10T12:05:00Z",
  },
  {
    id: 2,
    name: "Temperature Sensor 2",
    zone: "Greenhouse",
    type: "temperature",
    value: 29,
    unit: "°C",
    battery_level: 45,
    signal_strength: 62,
    status: "warning",
    last_update: "2025-09-10T11:45:00Z",
  },
  // more mock sensors...
];


function CircularProgress({ value, max = 100, size = 80, strokeWidth = 8, color, children }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value, max);
  const offset = circumference - (circumference * progress) / max;
  
  return (
    <svg
      width={size}
      height={size}
      className="inline-block"
    >
      <circle
        stroke="#eee"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <foreignObject
        x="0" y="0" width={size} height={size}
      >
        <div className="flex flex-col justify-center items-center h-full text-center" style={{color}}>
          {children}
        </div>
      </foreignObject>
    </svg>
  );
}


export default function Sensors() {
  const navigate = useNavigate();
  const [sensors, setSensors] = React.useState(sensorsMock);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Sensor Network</h1>
          <p className="text-gray-500">Monitor all sensors across zones</p>
        </div>
        <button onClick={() => navigate("/sensors/add")}
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
        >
          + Add Sensor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sensors.map(s => (
          <div key={s.id} className="bg-white p-6 rounded shadow space-y-4">
            <h2 className="text-lg font-semibold">{s.name}</h2>
            <p>{s.zone}</p>
            <button onClick={() => navigate(`/sensors/${s.id}`)}
              className="w-full py-2 mt-4 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              View Details
            </button>
          </div>
        ))}
        {sensors.length === 0 && (
          <p className="text-center text-gray-500">No sensors available.</p>
        )}
      </div>
    </div>
  );
}
