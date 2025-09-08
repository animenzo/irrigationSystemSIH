const axios = require('axios');
const config = require('../config/config');

class BlynkService {
  constructor() {
    this.baseURL = `https://${config.BLYNK_SERVER}/external/api`;
    this.auth = config.BLYNK_AUTH_TOKEN;
  }

  async getSensorData() {
    try {
      // Get data from virtual pins
      const [moisture, temperature, humidity, tankLevel] = await Promise.all([
        this.getPin('V0'), // moisture
        this.getPin('V1'), // temperature
        this.getPin('V2'), // humidity
        this.getPin('V3'), // tank level
      ]);

      return {
        moisture: parseFloat(moisture),
        temperature: parseFloat(temperature),
        humidity: parseFloat(humidity),
        tankLevel: parseFloat(tankLevel),
      };
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      throw error;
    }
  }

  async getPin(pin) {
    const response = await axios.get(
      `${this.baseURL}/get?token=${this.auth}&${pin}`
    );
    return response.data[0];
  }

  async setPump(status) {
    try {
      // Assuming V4 controls the pump
      await axios.get(
        `${this.baseURL}/update?token=${this.auth}&V4=${status ? '1' : '0'}`
      );
      return true;
    } catch (error) {
      console.error('Error controlling pump:', error);
      throw error;
    }
  }
}

module.exports = new BlynkService();