import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddSensor() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    zone: "",
    type: "",
    unit: "",
    battery_level: 100,
    signal_strength: 100,
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    // Validate form
    if (!form.name || !form.zone || !form.type) {
      alert("Please fill all required fields.");
      return;
    }
    console.log("Submitting sensor", form);
    // TODO: Save to backend or context
    alert("Sensor added (mock). Redirecting to sensors list...");
    navigate("/sensors");
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add New Sensor</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange}
          placeholder="Sensor Name" className="w-full px-3 py-2 border rounded" required />
        <input name="zone" value={form.zone} onChange={handleChange}
          placeholder="Zone" className="w-full px-3 py-2 border rounded" required />
        <input name="type" value={form.type} onChange={handleChange}
          placeholder="Type (e.g. temperature)" className="w-full px-3 py-2 border rounded" required />

        <input name="unit" value={form.unit} onChange={handleChange}
          placeholder="Unit (e.g. °C)" className="w-full px-3 py-2 border rounded" />

        <input name="battery_level" type="number" min={0} max={100}
          value={form.battery_level} onChange={handleChange}
          placeholder="Battery Level (%)" className="w-full px-3 py-2 border rounded" />

        <input name="signal_strength" type="number" min={0} max={100}
          value={form.signal_strength} onChange={handleChange}
          placeholder="Signal Strength (%)" className="w-full px-3 py-2 border rounded" />

        <button type="submit" className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Add Sensor
        </button>
      </form>
    </div>
  );
}
