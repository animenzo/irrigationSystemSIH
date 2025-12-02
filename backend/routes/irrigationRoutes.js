const express = require('express');
const IrrigationData = require('../models/irrigationData');
const blynkService = require('../services/blynkService');

const router = express.Router();

// POST /api/irrigation
router.post('/irrigation', async (req, res) => {
  try {
    const irrigationData = await IrrigationData.create(req.body);
    res.status(201).json(irrigationData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/irrigation
router.get('/irrigation', async (req, res) => {
  try {
    const { hours = 24 } = req.query;
    const irrigationData = await IrrigationData.find({
      timestamp: {
        $gte: new Date(Date.now() - hours * 60 * 60 * 1000)
      }
    }).sort({ timestamp: -1 });
    res.json(irrigationData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/irrigation/auto
router.post('/irrigation/auto', async (req, res) => {
  try {
    const { farmId, auto } = req.body;
    if (!farmId) {
      return res.status(400).json({ error: 'farmId is required' });
    }
    await blynkService.setAutoMode(auto);
    res.json({ success: true, autoMode: auto });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/irrigation/status
router.get('/irrigation/status', async (req, res) => {
  try {
    const { farmId } = req.query;
    if (!farmId) {
      return res.status(400).json({ error: 'farmId is required' });
    }
    const latest = await IrrigationData.findOne({ farmId }).sort({ timestamp: -1 });
    const status = latest ? latest.pumpData : false;
    res.json({ status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/pump
router.post('/pump', async (req, res) => {
  try {
    const { status, targetMoisture, farmId } = req.body;
    const action = status ? true : false;
    const result = await blynkService.controlPump(action, targetMoisture);

    await IrrigationData.create({
      pumpData: action,
      targetMoisture: targetMoisture || 50,
      farmId
    });

    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
