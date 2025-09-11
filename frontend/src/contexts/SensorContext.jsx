import React, { createContext, useContext, useState, useEffect } from 'react';
import { sensorService } from '../services/api';

const SensorContext = createContext();

export function SensorProvider({ children }) {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSensors = async (farmId = null) => {
    setLoading(true);
    setError(null);
    try {
      const data = await sensorService.getAllSensors(farmId);
      setSensors(data);
    } catch (err) {
      setError(err.message);
      setSensors([]);
    } finally {
      setLoading(false);
    }
  };

  const createSensor = async (sensorData) => {
    setLoading(true);
    setError(null);
    try {
      const newSensor = await sensorService.createSensor(sensorData);
      setSensors(prev => [...prev, newSensor]);
      return newSensor;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSensor = async (id, sensorData) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await sensorService.updateSensor(id, sensorData);
      setSensors(prev => prev.map(s => s._id === id ? updated : s));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSensor = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await sensorService.deleteSensor(id);
      setSensors(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensors();
  }, []);

  return (
    <SensorContext.Provider value={{ sensors, loading, error, createSensor, updateSensor, deleteSensor, fetchSensors }}>
      {children}
    </SensorContext.Provider>
  );
}

export const useSensors = () => {
  const context = useContext(SensorContext);
  if (!context) {
    throw new Error('useSensors must be used within a SensorProvider');
  }
  return context;
};