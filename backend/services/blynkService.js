const axios = require('axios');
const config = require('../config/config');

class BlynkService {
  constructor() {
    this.baseURL = `https://${config.BLYNK_SERVER}/external/api`;
    this.auth = config.BLYNK_AUTH_TOKEN;
    this.pinMapping = {
      v0: 'moisture1', // Soil Moisture Field 1
      v1: 'moisture2', // Soil Moisture Field 2
      v2: 'temperature', // Temperature sensor
      v3: 'humidity', // Humidity sensor
      v4: 'isRain', // Rain detection sensor
      v5: 'physicalBtn', // Physical button status
      v6: 'pumpStatus', // Pump on/off status
      v7: 'tankLevel' // Water tank level
    };
  }

  async getSensorData() {
      try {
        // Get data from virtual pins
        const [moisture1, moisture2, temperature, humidity, isRain, physicalBtn, pumpStatus, tankLevel] = await Promise.all([
          this.getPin('v0'), // Soil Moisture Field 1
          this.getPin('v1'), // Soil Moisture Field 2
          this.getPin('v2'), // Temperature sensor
          this.getPin('v3'), // Humidity sensor
          this.getPin('v4'), // Rain detection sensor
          this.getPin('v5'), // Physical button status
          this.getPin('v6'), // Pump on/off status
          this.getPin('v7') // Water tank level
        ]);

        const timestamp = new Date().toISOString();
        
        return {
          moisture1: parseFloat(moisture1) || 0,
          moisture2: parseFloat(moisture2) || 0,
          temperature: parseFloat(temperature) || 0,
          humidity: parseFloat(humidity) || 0,
          isRain: parseInt(isRain) || 0,
          physicalBtn: parseInt(physicalBtn) || 0,
          pumpStatus: parseInt(pumpStatus) || 0,
          tankLevel: parseFloat(tankLevel) || 0,
          timestamp,
        };
      } catch (error) {
        console.error('Error fetching sensor data:', error);
        throw error;
      }
    }

  async getPin(pin) {
      try {
        const response = await axios.get(
          `${this.baseURL}/get?token=${this.auth}&${pin}`, // Remove 'pin=' from URL
          { timeout: 10000 }
        );
        console.log(`Response for pin ${pin}:`, response.data, 'Type:', typeof response.data);
        
        // Add better error handling
        if (response.status === 200 && response.data && !response.data.error) {
          let value;
          if (typeof response.data === 'string') {
            value = response.data;
          } else if (Array.isArray(response.data) && response.data.length > 0) {
            value = response.data[0];
          } else {
            value = response.data;
          }
          console.log(`Parsed value for pin ${pin}:`, value, 'Type:', typeof value);
          return value;
        } else {
          console.warn(`Warning: Pin ${pin} returned:`, response.data);
          return 0; // Return default value on error
        }
      } catch (error) {
        console.error(`Failed to get pin ${pin}:`, error.message);
        return 0; // Return default value on error
      }
    }

  async setPin(pin, value) {
      try {
        const pinLower = pin.toLowerCase();
        const url = `${this.baseURL}/update?token=${this.auth}&pin=${pinLower}&value=${value}`;
        console.log(`Calling Blynk update for pin ${pin}: ${url}`);
        const response = await axios.get(url, { timeout: 1000 });
        console.log(`Update response for pin ${pin}:`, response.data);
        
        if (response.status === 200 && !response.data.error) {
          return true;
        } else {
          throw new Error(`Failed to set pin ${pin}`);
        }
      } catch (error) {
        console.error(`Error setting pin ${pin}:`, error.message);
        if (error.response) {
          console.error('Update response status:', error.response.status);
          console.error('Update response data:', error.response.data);
        }
        throw error;
      }
    }
  async checkConnection() {
    return await this.isDeviceOnline();
  }

  async isDeviceOnline() {
    try {
      const response = await axios.get(
        `${this.baseURL}/get?token=${this.auth}&v0`,
        { timeout: 1000 }
      );

      if (response.status === 200) {
        if (response.data &&
            typeof response.data === 'object' &&
            response.data.error &&
            response.data.error.includes('Device not online')) {
          return false;
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Device online check failed:', error.message);
      return false;
    }
  }

  async getAllPins() {
    try {
      const [moisture1, moisture2, temperature, humidity, isRain, physicalBtn, pumpStatus, tankLevel] = await Promise.all([
        this.getPin('v0'), // moisture1 - Soil Moisture Field 1 (%)
        this.getPin('v1'), // moisture2 - Soil Moisture Field 2 (%)
        this.getPin('v2'), // temperature - Temperature sensor (°C)
        this.getPin('v3'), // humidity - Humidity sensor (%)
        this.getPin('v4'), // isRain - Rain detection sensor (0/1)
        this.getPin('v5'), // physicalBtn - Physical button status (0/1)
        this.getPin('v6'), // pumpStatus - Pump on/off status (0/1)
        this.getPin('v7'), // tankLevel - Water tank level (%)
      ]);

      return {
        moisture1: parseFloat(moisture1) || 0,
        moisture2: parseFloat(moisture2) || 0,
        temperature: parseFloat(temperature) || 0,
        humidity: parseFloat(humidity) || 0,
        isRain: parseInt(isRain) || 0,
        physicalBtn: parseInt(physicalBtn) || 0,
        pumpStatus: parseInt(pumpStatus) || 0,
        tankLevel: parseFloat(tankLevel) || 0,
      };
    } catch (error) {
      console.error('Error fetching all pins:', error);
      throw error;
    }
  }
}

module.exports = new BlynkService();