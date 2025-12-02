const express = require('express');
const IrrigationData = require('../models/irrigationData');
const blynkService = require('../services/blynkService');

const router = express.Router();

// GET /api/blynk/check
router.get('/check', async (req, res) => {
  try {
    const connected = await blynkService.checkConnection();
    res.json({ connected });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/blynk/pins
router.get('/pins', async (req, res) => {
  try {
    const pins = await blynkService.getAllPins();
    res.json(pins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/blynk/setPin
router.post('/setPin', async (req, res) => {
  try {
    const { pin, value } = req.body;
    if (!pin || value === undefined) {
      return res.status(400).json({ error: 'Pin and value required' });
    }
    await blynkService.setPin(pin, value);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/blynk/controlPump
router.post('/controlPump', async (req, res) => {
  try {
    const { action, targetMoisture, farmId, duration } = req.body;
    if (action === undefined) {
      return res.status(400).json({ error: 'Action is required' });
    }
    const result = await blynkService.controlPump(action, targetMoisture, duration || 0);

    if (farmId) {
      await IrrigationData.create({
        pumpData: action,
        targetMoisture: targetMoisture || 50,
        farmId
      });
    }

    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Error controlling pump:', error);
    res.status(500).json({ error: 'Failed to control pump' });
  }
});

// POST /api/blynk/setTargetMoisture
router.post('/setTargetMoisture', async (req, res) => {
  try {
    const { percentage } = req.body;
    if (percentage === undefined || percentage < 1 || percentage > 100) {
      return res.status(400).json({ error: 'Valid percentage (1-100) is required' });
    }
    const success = await blynkService.setTargetMoisture(percentage);
    res.json({ success });
  } catch (error) {
    console.error('Error setting target moisture:', error);
    res.status(500).json({ error: 'Failed to set target moisture' });
  }
});

// GET /api/blynk/deviceStatus
router.get('/deviceStatus', async (req, res) => {
  try {
    const status = await blynkService.checkDeviceConnection();
    res.json(status);
  } catch (error) {
    console.error('Error checking device status:', error);
    res.status(500).json({ error: 'Failed to check device status' });
  }
});

// GET /api/blynk/dashboard-data
router.get('/dashboard-data', async (req, res) => {
  try {
    const { city = 'Udaipur' } = req.query;
    const dashboardData = await blynkService.getDashboardData(city);
    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/blynk/pump/control
router.post('/pump/control', async (req, res) => {
  try {
    const { action, targetMoisture, farmId, duration } = req.body;
    const result = await blynkService.controlPump(action, targetMoisture, duration);

    if (farmId) {
      await IrrigationData.create({
        pumpData: action,
        targetMoisture: targetMoisture || 50,
        farmId
      });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
