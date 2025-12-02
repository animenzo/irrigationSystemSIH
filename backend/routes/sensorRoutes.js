const express = require('express');
const mongoose = require('mongoose');
const Sensor = require('../models/sensor');
const SensorData = require('../models/sensorData');
const IrrigationData = require('../models/irrigationData');
const blynkService = require('../services/blynkService');

const router = express.Router();

// ---- CRUD for sensors -----
// GET /api/sensors
router.get('/sensors', async (req, res) => {
  try {
    const { farmId } = req.query;
    let query = {};
    if (farmId) {
      query.farmId = farmId;
    }
    const sensors = await Sensor.find(query).populate('farmId', 'name');
    res.json(sensors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/sensors
router.post('/sensors', async (req, res) => {
  try {
    const sensor = await Sensor.create(req.body);
    const populatedSensor = await Sensor.findById(sensor._id).populate('farmId', 'name');
    res.status(201).json(populatedSensor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/sensors/:id
router.get('/sensors/:id', async (req, res) => {
  try {
    const sensor = await Sensor.findById(req.params.id).populate('farmId', 'name');
    if (!sensor) {
      return res.status(404).json({ error: 'Sensor not found' });
    }
    res.json(sensor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/sensors/:id
router.put('/sensors/:id', async (req, res) => {
  try {
    const sensor = await Sensor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('farmId', 'name');
    if (!sensor) {
      return res.status(404).json({ error: 'Sensor not found' });
    }
    res.json(sensor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/sensors/:id
router.delete('/sensors/:id', async (req, res) => {
  try {
    const sensor = await Sensor.findByIdAndDelete(req.params.id);
    if (!sensor) {
      return res.status(404).json({ error: 'Sensor not found' });
    }
    res.json({ message: 'Sensor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---- Existing Sensor/Blynk-related endpoints ----

// GET /api/sensor-data
router.get('/sensor-data', async (req, res) => {
  try {
    const sensorData = await blynkService.getSensorData();
    res.json(sensorData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/historical-data
router.get('/historical-data', async (req, res) => {
  try {
    const { farmId, duration } = req.query;
    const hours = parseInt(duration) || 24;

    const data = await SensorData.find({
      farmId,
      timestamp: {
        $gte: new Date(Date.now() - hours * 60 * 60 * 1000)
      }
    }).sort({ timestamp: -1 });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/test-save-sensor  (temp test route)
router.post('/test-save-sensor', async (req, res) => {
  try {
    const { moisture1, moisture2, temperature, humidity, tankLevel, pumpStatus } = req.body;
    if (!moisture1 || !moisture2 || !temperature || !humidity || tankLevel === undefined || pumpStatus === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const testDoc = await SensorData.create({
      farmId: new mongoose.Types.ObjectId(), // dummy farmId
      moisture1: parseFloat(moisture1),
      moisture2: parseFloat(moisture2),
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      tankLevel: parseFloat(tankLevel),
      pumpStatus: Boolean(pumpStatus)
    });
    res.json({ success: true, id: testDoc._id });
  } catch (error) {
    console.error('Schema validation error:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
