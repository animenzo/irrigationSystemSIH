import React from "react";
import { useFarms } from "../contexts/FarmContext"; // adjust path as needed

const FarmCard = ({ farm, onTogglePump }) => (
  <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
    {/* ...same as before... */}
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-xl font-semibold text-gray-800">{farm.name}</h3>
        <p className="text-gray-600">{farm.location}</p>
      </div>
      <span className={`px-3 py-1 rounded-full text-sm ${farm.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {farm.isActive ? 'Active' : 'Inactive'}
      </span>
    </div>
    {/* ... (rest unchanged)... */}
    <button
      onClick={() => onTogglePump(farm.id)}
      className={`w-full py-2 px-4 rounded-md transition-colors ${
        farm.pumpRunning
          ? 'bg-red-500 hover:bg-red-600 text-white'
          : 'bg-green-500 hover:bg-green-600 text-white'
      }`}
    >
      {farm.pumpRunning ? 'Stop Pump' : 'Start Pump'}
    </button>
  </div>
);

export default function IrrigationControl() {
  const { farms, togglePump, toggleAllPumps } = useFarms();

  const handleToggleAllPumps = () => {
    const areAllRunning = farms.length > 0 && farms.every(f => f.pumpRunning);
    toggleAllPumps(!areAllRunning);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Irrigation Control</h1>
        <button
          onClick={handleToggleAllPumps}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors"
        >
          {farms.length > 0 && farms.every(f => f.pumpRunning) ? 'Stop All Zones' : 'Start All Zones'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farms.map(farm => (
          <FarmCard
            key={farm.id}
            farm={farm}
            onTogglePump={togglePump}
          />
        ))}
      </div>
      {farms.length === 0 && (
        <div className="text-gray-400 text-center mt-10 text-lg">No farms found. Please add a farm first.</div>
      )}
    </div>
  );
}
