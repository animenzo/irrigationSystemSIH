const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/config');
const SensorData = require('./models/sensorData');
const blynkService = require('./services/blynkService');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/api/sensor-data', async (req, res) => {
  try {
    const sensorData = await blynkService.getSensorData();
    
    // Save to database
    await SensorData.create({
      farmId: req.query.farmId,
      ...sensorData
    });

    res.json(sensorData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Control pump
app.post('/api/pump', async (req, res) => {
  try {
    const { status } = req.body;
    await blynkService.setPump(status);
    res.json({ success: true, pumpStatus: status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get historical data
app.get('/api/historical-data', async (req, res) => {
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

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});