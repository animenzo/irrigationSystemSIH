import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = 'https://irrigation-system-sih.vercel.app/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
export { api };
export const farmService = {
  async getAllFarms() {
    try {
      const response = await api.get(`/farms`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch farms');
    }
  },

  async createFarm(farmData) {
    try {
      const response = await api.post('/farms', farmData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create farm');
    }
  },

  async updateFarm(id, farmData) {
    try {
      const response = await api.put(`/farms/${id}`, farmData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update farm');
    }
  },
  
  async getFarmById(id) {
    try {
      const response = await api.get(`/farms/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch farm');
    }
  },

  async deleteFarm(id) {
    try {
      await api.delete(`/farms/${id}`);
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete farm');
    }
  }
};

export const irrigationService = {
  async getIrrigationData(hours = 24) {
    try {
      const response = await api.get(`/irrigation?hours=${hours}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch irrigation data');
    }
  },

  async controlPump(action, farmId, targetMoisture) {
    try {
      const response = await api.post('/blynk/pump/control', { action, farmId, targetMoisture });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to control pump');
    }
  },

  async getStatus(farmId) {
    try {
      const response = await api.get(`/irrigation/status?farmId=${farmId}`);
      return response.data.status;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch irrigation status');
    }
  },

};


export const sensorService = {
async getSensorData(farmId) {
    try {
      const response = await api.get(`/sensor-data?farmId=${farmId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch sensor data');
    }
  },

  async addSensor(sensorData) {
    try {
      const response = await api.post('/sensors', sensorData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to add sensor');
    }
  },


 async getAllSensors(farmId = null) {
   try {
     const query = farmId ? `?farmId=${farmId}` : '';
     const response = await api.get(`/sensors${query}`);
     return response.data;
   } catch (error) {
     throw new Error(error.response?.data?.error || 'Failed to fetch sensors');
   }
 },

 async getSensorById(id) {
   try {
     const response = await api.get(`/sensors/${id}`);
     return response.data;
   } catch (error) {
     throw new Error(error.response?.data?.error || 'Failed to fetch sensor');
   }
 },

  async updateSensor(id, sensorData) {
    try {
      const response = await api.put(`/sensors/${id}`, sensorData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update sensor');
    }
  },

  async deleteSensor(id) {
    try {
      await api.delete(`/sensors/${id}`);
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete sensor');
    }
  }
};

export const scheduleService = {
  async getAllSchedules(farmId) {
    try {
      const query = farmId ? `?farmId=${farmId}` : '';
      const response = await api.get(`/schedules${query}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch schedules');
    }
  },

  async createSchedule(scheduleData) {
    try {
      const response = await api.post('/schedules', scheduleData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create schedule');
    }
  },

  async getScheduleById(id) {
    try {
      const response = await api.get(`/schedules/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch schedule');
    }
  },

  async updateSchedule(id, scheduleData) {
    try {
      const response = await api.put(`/schedules/${id}`, scheduleData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update schedule');
    }
  },

  async deleteSchedule(id) {
    try {
      await api.delete(`/schedules/${id}`);
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete schedule');
    }
  }
};
