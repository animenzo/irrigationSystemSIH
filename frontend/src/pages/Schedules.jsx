import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSchedules } from '../contexts/ScheduleContext';
console.log('useSchedules function:', useSchedules);

const dayShorts = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const dayFull = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

export default function Schedules() {
  const { schedules, loading, error, deleteSchedule, fetchSchedules } = useSchedules();
  const navigate = useNavigate();

  // useEffect(() => {
  //   fetchSchedules();
  // }, [fetchSchedules]);

  // Calculations for stats
  const total = schedules.length;
  const active = schedules.filter(s => s.status === "Active").length;
  const paused = schedules.filter(s => s.status === "Paused").length;
  const dailyMins = schedules
    .filter(s => s.status === "Active")
    .reduce((sum, s) => sum + (s.duration || 0), 0);

  if (loading) {
    return <div className="p-6">Loading schedules...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Irrigation Schedules</h1>
          <p className="text-gray-500">Manage automated irrigation and maintenance schedules</p>
        </div>
        <button
          onClick={() => navigate("/schedules/create")}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow transition"
        >
          + Create Schedule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schedules.map(s => (
          <div
            key={s._id}
            className={`bg-white border-l-4 rounded-lg shadow-md p-6 flex flex-col border-gray-100 ${s.status==="Active" ? "border-green-400" : "border-yellow-400"} `}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-lg">{s.name}</div>
                <div className="text-xs text-gray-400">{s.zone}</div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                {s.status}
              </span>
            </div>
            <div className="flex items-center gap-8 mt-2 mb-2 text-gray-700">
              <div><span className="font-semibold">{s.time}</span> <span className="text-gray-400">• {s.duration} min</span></div>
              <span className="hidden md:inline text-gray-400">{s.farmId?.name || s.farm}</span>
            </div>
            <div className="flex gap-2 mb-2">
              {s.days.map((val, i) => (
                <span
                  key={i}
                  className={`w-7 h-7 flex items-center justify-center rounded-full font-bold text-sm ${val ? "bg-green-600 text-white" : "bg-gray-100 text-gray-400 border border-gray-200"}`}>
                  {dayShorts[i]}
                </span>
              ))}
            </div>
            <div className="text-sm text-gray-500 mb-2">
              Next run:&nbsp;
              <b>{s.nextRun || "Auto calculated"}</b>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate(`/schedules/edit/${s._id}`)} className="text-blue-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50">
                Edit
              </button>
              <button onClick={() => {
                if (window.confirm('Are you sure you want to delete this schedule?')) {
                  deleteSchedule(s._id);
                }
              }} className="text-red-500 flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
        <div className="bg-white shadow rounded text-center py-3">
          <div className="text-2xl font-bold">{total}</div>
          <div className="text-xs text-gray-500 mt-1">Total Schedules</div>
        </div>
        <div className="bg-white shadow rounded text-center py-3">
          <div className="text-2xl font-bold">{active}</div>
          <div className="text-xs text-gray-500 mt-1">Active</div>
        </div>
        <div className="bg-white shadow rounded text-center py-3">
          <div className="text-2xl font-bold">{paused}</div>
          <div className="text-xs text-gray-500 mt-1">Paused</div>
        </div>
        <div className="bg-white shadow rounded text-center py-3">
          <div className="text-2xl font-bold">{Math.floor(dailyMins/60)}h {dailyMins%60}m</div>
          <div className="text-xs text-gray-500 mt-1">Daily Runtime</div>
        </div>
      </div>
    </div>
  );
}
