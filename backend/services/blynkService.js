const axios = require('axios');
const config = require('../config/config');

class BlynkService {
  constructor() {
    this.baseURL = `https://${config.BLYNK_SERVER}/external/api`;
    this.auth = config.BLYNK_AUTH_TOKEN;
    this.weatherAPIKey = config.WEATHER_API_KEY; // Add to your config
    this.pinMapping = {
      v0: 'moisture1',      // Soil Moisture sensor 1 (%)
      v1: 'moisture2',      // Soil Moisture sensor 2 (%)
      v2: 'temperature',    // Temperature sensor (°C)
      v3: 'humidity',       // Humidity sensor (%)
      v4: 'isRain',         // Rain detection sensor (0/1)
      v5: 'physicalBtn',    // Physical button status (0/1)
      v6: 'pumpStatus',     // Pump on/off status from Blynk IoT (0/1)
      v7: 'tankLevel',      // Water tank height (%)
      v8: 'pumpControl',    // OUTPUT - Send pump commands (0=Stop, 1=Start) to Arduino
      v9: 'targetMoisture' , // OUTPUT - Send target moisture percentage (1-100%)
      // v10:'serverStatus' // OUTPUT - Server connection status (0=Disconnected, 1=Connected)
    };
  }

  async getSensorData() {
    try {
      // Get data from virtual pins (READ operations) - only input pins v0-v7
      const [moisture1, moisture2, temperature, humidity, isRain, physicalBtn, pumpStatus, tankLevel] = await Promise.all([
        this.getPin('v0'), this.getPin('v1'), this.getPin('v2'), this.getPin('v3'),
        this.getPin('v4'), this.getPin('v5'), this.getPin('v6'), this.getPin('v7')
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
        pumpControl: 0,  // Output pin - default
        targetMoisture: 30,  // Output pin - default
        timestamp,
      };
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      throw error;
    }
  }

  // NEW: Weather API Integration
  async getCurrentWeather(city = 'Udaipur') {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.weatherAPIKey}&units=metric`,
        { timeout: 10000 }
      );

      return {
        city: response.data.name,
        country: response.data.sys.country,
        temperature: Math.round(response.data.main.temp),
        description: response.data.weather[0].description,
        main: response.data.weather[0].main,
        humidity: response.data.main.humidity,
        windSpeed: response.data.wind.speed,
        icon: response.data.weather[0].icon,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Weather error:', error.response?.status, error.response?.data);
      return {
        city: 'Udaipur',
        country: 'IN',
        temperature: 31,
        description: "Partly cloudy",
        main: 'Clouds',
        humidity: 65,
        windSpeed: 3.2,
        icon: '03d',
        timestamp: new Date().toISOString()
      };
    }
  }

  async getPin(pin) {
    try {
      const response = await axios.get(
        `${this.baseURL}/get?token=${this.auth}&pin=${pin}`,
        { timeout: 10000 }
      );
      
      if (response.status === 200 && response.data && !response.data.error) {
        let value;
        if (typeof response.data === 'string') {
          value = response.data;
        } else if (Array.isArray(response.data) && response.data.length > 0) {
          value = response.data[0];
        } else {
          value = response.data;
        }
        return value;
      } else {
        console.warn(`Warning: Pin ${pin} returned:`, response.data);
        return 0;
      }
    } catch (error) {
      console.error(`Failed to get pin ${pin}:`, error.message);
      return 0;
    }
  }

  async setPin(pin, value) {
    try {
      const pinLower = pin.toLowerCase();
      const url = `${this.baseURL}/update?token=${this.auth}&pin=${pinLower}&value=${value}`;
      console.log(`Calling Blynk update for pin ${pin}: ${url}`);
      const response = await axios.get(url, { timeout: 1500 });
      
      if (response.status === 200 && !response.data.error) {
        return true;
      } else {
        throw new Error(`Failed to set pin ${pin}`);
      }
    } catch (error) {
      console.error(`Error setting pin ${pin}:`, error.message);
      throw error;
    }
  }

  // ENHANCED: Pump control with target moisture
  async controlPump(action, targetMoisture = null, duration = null) {
    console.log('BlynkService controlPump called with:', { action, targetMoisture, duration });
    try {
      const pumpValue = action ? 1 : 0;
      console.log(`Sending pump control to v8: ${pumpValue}`);
      
      // Send pump control command
      const pumpResult = await this.setPin('v8', pumpValue);
      console.log('v8 setPin result:', pumpResult);
      
      // Set target moisture if provided
      let targetResult = null;
      if (targetMoisture && targetMoisture >= 1 && targetMoisture <= 100) {
        console.log(`Setting target moisture via V9: ${targetMoisture}%`);
        targetResult = await this.setPin('v9', targetMoisture);
        console.log('v9 setPin result:', targetResult);
      }
      
      // Log duration if provided
      if (duration && duration > 0) {
        console.log(`Pump will run for: ${duration} minutes`);
      }
      
      return {
        success: true,
        action: action ? 'start' : 'stop',
        targetMoisture: targetMoisture || null,
        duration: duration || null,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error controlling pump:', error);
      throw error;
    }
  }

  async setTargetMoisture(percentage) {
    try {
      if (percentage < 1 || percentage > 100) {
        throw new Error('Percentage must be between 1 and 100');
      }
      console.log(`Setting target moisture via V9: ${percentage}%`);
      await this.setPin('v9', percentage);
      return true;
    } catch (error) {
      console.error('Error setting target moisture:', error);
      throw error;
    }
  }


  // ENHANCED: Get comprehensive dashboard data including weather
  async getDashboardData(city = 'Udaipur') {
    try {
      const [sensorData, weatherData, deviceStatus] = await Promise.all([
        this.getSensorData(),
        this.getCurrentWeather(city),
        this.checkDeviceConnection()
      ]);

      const averageMoisture = Math.round((sensorData.moisture1 + sensorData.moisture2) / 2);
      
      // Generate alerts based on data
      const alerts = [];
      if (averageMoisture < sensorData.targetMoisture) alerts.push('Low soil moisture detected');
      if (sensorData.tankLevel < 20) alerts.push('Low water tank level');
      if (sensorData.isRain && sensorData.pumpStatus) alerts.push('Rain detected - consider stopping irrigation');
      if (sensorData.physicalBtn === 0 && sensorData.pumpStatus === 1) alerts.push('Pump running without physical switch enabled');

      return {
        sensors: {
          ...sensorData,
          averageMoisture
        },
        weather: weatherData,
        device: deviceStatus,
        alerts,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  async checkDeviceConnection() {
    try {
      const response = await this.getPin('v0');
      if (response !== null && response !== undefined) {
        return {
          status: 'online',
          lastSeen: 'Just now',
          message: 'Arduino Connected'
        };
      } else {
        throw new Error('No data received from device');
      }
    } catch (error) {
      return {
        status: 'offline',
        lastSeen: null,
        message: 'Arduino Disconnected'
      };
    }
  }

  async getAverageMoisture() {
    try {
      const data = await this.getSensorData();
      return Math.round((data.moisture1 + data.moisture2) / 2);
    } catch (error) {
      console.error('Error calculating average moisture:', error);
      return 0;
    }
  }
}

module.exports = new BlynkService();
