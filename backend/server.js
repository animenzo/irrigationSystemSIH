const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/config');
const SensorData = require('./models/sensorData');
const Farm = require('./models/farm');
const IrrigationData = require('./models/irrigationData');
const Schedule = require('./models/schedule');
const Sensor = require('./models/sensor');
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

// Farm Routes
app.post('/api/farms', async (req, res) => {
  try {
    const farm = await Farm.create(req.body);
    res.status(201).json(farm);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/farms', async (req, res) => {
  try {
    const farms = await Farm.find();
    res.json(farms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/farms/:id', async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) {
      return res.status(404).json({ error: 'Farm not found' });
    }
    res.json(farm);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/farms/:id', async (req, res) => {
  try {
    const farm = await Farm.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!farm) {
      return res.status(404).json({ error: 'Farm not found' });
    }
    res.json(farm);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/farms/:id', async (req, res) => {
  try {
    const farm = await Farm.findByIdAndDelete(req.params.id);
    if (!farm) {
      return res.status(404).json({ error: 'Farm not found' });
    }
    res.json({ message: 'Farm deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Schedule Routes
app.get('/api/schedules', async (req, res) => {
  try {
    const { farmId } = req.query;
    let query = {};
    if (farmId) {
      query.farmId = farmId;
    }
    const schedules = await Schedule.find(query).populate('farmId', 'name');
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/schedules', async (req, res) => {
  try {
    const schedule = await Schedule.create(req.body);
    const populatedSchedule = await Schedule.findById(schedule._id).populate('farmId', 'name');
    res.status(201).json(populatedSchedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/schedules/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id).populate('farmId', 'name');
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/schedules/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('farmId', 'name');
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json(schedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/schedules/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Irrigation Routes
app.post('/api/irrigation', async (req, res) => {
  try {
    const irrigationData = await IrrigationData.create(req.body);
    res.status(201).json(irrigationData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/irrigation', async (req, res) => {
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

// Existing Sensor Routes
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
    const { status, farmId } = req.body;
    await blynkService.setPin('V3', status ? 1 : 0);
    
    // Save pump status to irrigation data
    await IrrigationData.create({
      pumpData: status,
      targetMoisture: req.body.targetMoisture || 50,
      farmId
    });
    
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

// Blynk API Routes
app.get('/api/blynk/check', async (req, res) => {
  try {
    const connected = await blynkService.checkConnection();
    res.json({ connected });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/blynk/pins', async (req, res) => {
  try {
    const pins = await blynkService.getAllPins();
    res.json(pins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/blynk/setPin', async (req, res) => {
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

 app.listen(config.PORT, () => {
   console.log(`Server running on port ${config.PORT}`);
 });