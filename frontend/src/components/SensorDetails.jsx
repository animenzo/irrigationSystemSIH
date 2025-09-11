import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const sensorsMock = [ /* same mock data as Sensors.jsx */];

export default function SensorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const sensor = sensorsMock.find(s => String(s.id) === id);

  if(!sensor) return (
    <div className="p-10 text-center text-gray-500">
      <p>Sensor not found.</p>
      <button className="text-blue-600 underline mt-4" onClick={() => navigate(-1)}>Go back</button>
    </div>
  );

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4">{sensor.name}</h2>
      <p>Zone: {sensor.zone}</p>
      <p>Type: {sensor.type}</p>
      <p>Value: {sensor.value}</p>
      <p>Battery: {sensor.battery_level}%</p>
      <p>Signal Strength: {sensor.signal_strength}%</p>
      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
}
