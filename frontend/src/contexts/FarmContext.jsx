
import React, { createContext, useContext, useEffect, useState } from 'react';
import { farmService } from '../services/api';

const FarmContext = createContext();

export function FarmProvider({ children }) {
    const [farms, setFarms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFarms();
    }, []);

    const fetchFarms = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await farmService.getAllFarms();
            setFarms(data);
        } catch (err) {
            setError(err.message);
            setFarms([]);
        } finally {
            setLoading(false);
        }
    };

    const addFarm = async (farmData) => {
        setLoading(true);
        setError(null);
        try {
            const newFarm = await farmService.createFarm(farmData);
            setFarms(prev => [...prev, newFarm]);
            return newFarm;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateFarm = async (id, farmData) => {
        setLoading(true);
        setError(null);
        try {
            const updated = await farmService.updateFarm(id, farmData);
            setFarms(prev => prev.map(f => f._id === id ? updated : f));
            return updated;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteFarm = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await farmService.deleteFarm(id);
            setFarms(prev => prev.filter(f => f._id !== id));
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <FarmContext.Provider value={{ farms, loading, error, addFarm, updateFarm, deleteFarm }}>
            {children}
        </FarmContext.Provider>
    );
}

export const useFarms = () => {
    const context = useContext(FarmContext);
    if (!context) {
        throw new Error('useFarms must be used within a FarmProvider');
    }
    return context;
};