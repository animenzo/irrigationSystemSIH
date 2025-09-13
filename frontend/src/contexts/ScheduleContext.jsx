import { scheduleService } from "@/services/api";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const ScheduleContext = createContext();

export function useSchedules() {
  return useContext(ScheduleContext);
}

export function ScheduleProvider({ children }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Utility to calculate nextRun
  const calculateNextRun = (schedule) => {
    const now = new Date();
    const [hours, minutes] = schedule.time.split(':').map(Number);
    const scheduleTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

    if (scheduleTime <= now) {
      scheduleTime.setDate(scheduleTime.getDate() + 1);
    }

    // Find next day that matches days array (0=Sunday, 1=Monday, etc.)
    while (!schedule.days[scheduleTime.getDay()]) {
      scheduleTime.setDate(scheduleTime.getDate() + 1);
    }

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[scheduleTime.getDay()];
    const timeStr = schedule.time;
    return `${dayName} ${timeStr}`;
  };

  // ✅ Use useCallback to memoize fetchSchedules function
  const fetchSchedules = useCallback(async (farmId = null) => {
    setLoading(true);
    setError(null);
    try {
      const data = await scheduleService.getAllSchedules(farmId);
      // Calculate nextRun for each
      const updatedSchedules = data.map(s => ({
        ...s,
        nextRun: calculateNextRun(s)
      }));
      setSchedules(updatedSchedules);
    } catch (err) {
      setError(err.message);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since it doesn't depend on any props/state

  const createSchedule = async (scheduleData) => {
    setLoading(true);
    setError(null);
    try {
      const newSchedule = await scheduleService.createSchedule(scheduleData);
      const updated = { ...newSchedule, nextRun: calculateNextRun(newSchedule) };
      setSchedules(prev => [...prev, updated]);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSchedule = async (id, scheduleData) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await scheduleService.updateSchedule(id, scheduleData);
      const withNextRun = { ...updated, nextRun: calculateNextRun(updated) };
      setSchedules(prev => prev.map(s => s._id === id ? withNextRun : s));
      return withNextRun;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSchedule = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await scheduleService.deleteSchedule(id);
      setSchedules(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Run only once on mount
  useEffect(() => {
    fetchSchedules();
  }, []); // Empty dependency array

  return (
    <ScheduleContext.Provider value={{ 
      schedules, 
      loading, 
      error, 
      createSchedule, 
      updateSchedule, 
      deleteSchedule, 
      fetchSchedules 
    }}>
      {children}
    </ScheduleContext.Provider>
  );
}
