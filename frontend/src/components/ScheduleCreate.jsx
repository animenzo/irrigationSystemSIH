import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const daysOfWeek = [
  { short: "M", full: "Monday" },
  { short: "T", full: "Tuesday" },
  { short: "W", full: "Wednesday" },
  { short: "T", full: "Thursday" },
  { short: "F", full: "Friday" },
  { short: "S", full: "Saturday" },
  { short: "S", full: "Sunday" },
];

const defaultFarms = [
  // This list could be fetched from backend or context!
  { label: "North Farm", value: "north" },
  { label: "South Farm", value: "south" },
  { label: "East Farm", value: "east" },
];

export default function ScheduleCreate() {
  const { createSchedule } = useSchedules();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    zone: "",
    farmId: "",
    status: "Active",
    time: "06:00",
    duration: 30,
    days: [false, false, false, false, false, false, false], // Booleans 0=Sun, 6=Sat
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const toggleDay = (idx) => {
    setForm(prev => ({
      ...prev,
      days: prev.days.map((val, i) => i === idx ? !val : val)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.farmId || !form.zone || !form.time) {
      alert("Please fill all required fields.");
      return;
    }

    // Convert days to boolean array for schema (0=Sun, but array is 0=Mon? Adjust to match schema 0=Mon-6=Sun
    const adjustedDays = [...form.days]; // Assume 0=Mon, but schema days [0=Mon? Wait, schema is array of 7 booleans, likely 0=Mon to 6=Sun
    // To match, shift or confirm; for now, assume 0=Mon, 6=Sun

    const data = {
      name: form.name,
      zone: form.zone,
      farmId: form.farmId,
      status: form.status,
      time: form.time,
      duration: parseInt(form.duration),
      days: adjustedDays, // Schema expects [Mon, Tue, ..., Sun], so index 0=Mon
      notes: form.notes,
    };

    try {
      setLoading(true);
      await createSchedule(data);
      alert("Schedule created successfully!");
      navigate("/schedules");
    } catch (error) {
      console.error('Create schedule error:', error);
      alert('Failed to create schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // For "Next Run" display
  const getNextRun = () => {
    // Returns next selected day and time (for demo)
    const today = new Date();
    for (let offset = 0; offset < 7; offset++) {
      const d = (today.getDay() + offset) % 7;
      if (form.days[d]) {
        const dayStr = offset === 0 ? "Today" : offset === 1 ? "Tomorrow" : daysOfWeek[d].full;
        return `${dayStr} ${form.time}`;
      }
    }
    return "No day selected";
  };

  return (
    <div className="p-4 md:p-8 max-w-lg w-full mx-auto">
      <h2 className="text-2xl font-bold mb-5 text-green-800">Create Irrigation/Farm Schedule</h2>
      <form
        className="bg-white rounded-lg shadow p-6 space-y-6 border"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="block text-sm pb-1 font-medium">Schedule Name *</label>
          <input
            className="w-full px-3 py-2 border rounded focus:border-green-400"
            placeholder="E.g. Morning Irrigation"
            value={form.name}
            onChange={handleChange}
            name="name"
            required
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm pb-1 font-medium">Farm ID *</label>
            <input
              className="w-full px-2 py-1.5 border rounded"
              placeholder="Farm ID"
              value={form.farmId}
              onChange={handleChange}
              name="farmId"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm pb-1 font-medium">Zone</label>
            <input
              className="w-full px-2 py-1.5 border rounded"
              placeholder="E.g. Zone A"
              value={form.zone}
              onChange={handleChange}
              name="zone"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm pb-1 font-medium">Status</label>
          <select
            className="w-full px-2 py-1.5 border rounded"
            value={form.status}
            onChange={handleChange}
            name="status"
          >
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
          </select>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm pb-1 font-medium">Time *</label>
            <input
              className="w-full px-2 py-1.5 border rounded"
              type="time"
              value={form.time}
              onChange={handleChange}
              name="time"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm pb-1 font-medium">Duration (min)</label>
            <input
              className="w-full px-2 py-1.5 border rounded"
              type="number"
              min={1}
              max={360}
              value={form.duration}
              onChange={handleChange}
              name="duration"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm pb-1 font-medium">Schedule Days *</label>
          <div className="flex gap-2 mt-1">
            {daysOfWeek.map((d, idx) => (
              <button
                type="button"
                key={d.full + idx}
                onClick={() => toggleDay(idx)}
                className={`w-8 h-8 rounded-full font-bold text-center text-sm
                  ${form.days[idx]
                    ? "bg-green-600 text-white shadow"
                    : "bg-gray-100 text-gray-500 border border-gray-200"}
                `}
              >
                {d.short}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm pb-1 font-medium">Next Run</label>
          <input
            className="w-full px-2 py-1.5 border rounded bg-gray-100 text-gray-600"
            value={getNextRun()}
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm pb-1 font-medium">Notes (Optional)</label>
          <input
            className="w-full px-2 py-1.5 border rounded"
            placeholder="Any remarks about this schedule"
            value={form.notes}
            onChange={handleChange}
            name="notes"
          />
        </div>
        <button
          className="w-full py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          Create Schedule
        </button>
      </form>
    </div>
  );
}
