import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSchedules } from "../contexts/ScheduleContext";

const daysOfWeek = ['M','T','W','T','F','S','S'];

export default function ScheduleEdit() {
  const { schedules, updateSchedule } = useSchedules();
  const { id } = useParams();
  const navigate = useNavigate();
  const sched = schedules.find(s => s._id === id);
  const [form, setForm] = useState();

  useEffect(() => {
    if (sched) setForm({ ...sched });
  }, [sched]);

  if (!form) return <div className="text-center py-10 text-gray-400">Schedule not found.</div>;

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const toggleDay = (idx) => setForm(f => ({
    ...f,
    days: f.days.map((v,i)=>i===idx?(v?0:1):v)
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSchedule(id, form);
    navigate("/schedules");
  };

  return (
    <div className="max-w-lg mx-auto p-8">
      <h2 className="text-xl font-bold mb-5">Edit Schedule</h2>
      <form className="space-y-4 bg-white rounded shadow p-6" onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} className="border rounded px-3 py-2 w-full" />
        <div className="flex gap-4">
          <input name="farmId" value={form.farmId} onChange={handleChange} className="border rounded px-3 py-2 w-full" placeholder="Farm ID" />
          <input name="zone" value={form.zone} onChange={handleChange} className="border rounded px-3 py-2 w-full" />
        </div>
        <select name="status" value={form.status} onChange={handleChange} className="border rounded px-3 py-2 w-full">
          <option value="Active">Active</option>
          <option value="Paused">Paused</option>
        </select>
        <div className="flex gap-4">
          <input type="time" name="time" value={form.time} onChange={handleChange} className="border rounded px-3 py-2 w-full"/>
          <input type="number" name="duration" value={form.duration} onChange={handleChange} className="border rounded px-3 py-2 w-full"/>
        </div>
        <div>
          <span className="block mb-1">Days</span>
          <div className="flex gap-2">
            {daysOfWeek.map((d, i) => (
              <button
                type="button"
                key={d+i}
                onClick={() => toggleDay(i)}
                className={`w-8 h-8 rounded-full font-bold text-center text-sm ${
                  form.days[i]
                    ? "bg-green-600 text-white shadow"
                    : "bg-gray-100 text-gray-500 border border-gray-200"
                }`}>{d}</button>
            ))}
          </div>
        </div>
        <input name="notes" value={form.notes} onChange={handleChange} className="border rounded px-3 py-2 w-full" placeholder="Notes"/>
        <button type="submit"  className="w-full bg-green-700 text-white py-2 rounded mt-3">Save Changes</button>
      </form>
    </div>
  );
}
