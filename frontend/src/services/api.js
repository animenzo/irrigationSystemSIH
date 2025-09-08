import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  async getSensorData(farmId) {
    const response = await axios.get(`${API_BASE_URL}/sensor-data`, {
      params: { farmId }
    });
    return response.data;
  },

  async getHistoricalData(farmId, duration = 24) {
    const response = await axios.get(`${API_BASE_URL}/historical-data`, {
      params: { farmId, duration }
    });
    return response.data;
  },

  async controlPump(status) {
    const response = await axios.post(`${API_BASE_URL}/pump`, { status });
    return response.data;
  }
};