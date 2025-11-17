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
      if (!mongoose.Types.ObjectId.isValid(farmId)) {
        return res.status(400).json({ error: 'Invalid farmId' });
      }
      query.farmId = farmId;
    }
    const schedules = await Schedule.find(query).populate('farmId', 'name');
    res.json(schedules);
  } catch (error) {
    console.error(error);
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

// Set auto mode for irrigation
app.post('/api/irrigation/auto', async (req, res) => {
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


// Get irrigation status
app.get('/api/irrigation/status', async (req, res) => {
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

// Sensor Routes
app.get('/api/sensors', async (req, res) => {
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

app.post('/api/sensors', async (req, res) => {
try {
  const sensor = await Sensor.create(req.body);
  const populatedSensor = await Sensor.findById(sensor._id).populate('farmId', 'name');
  res.status(201).json(populatedSensor);
} catch (error) {
  res.status(400).json({ error: error.message });
}
});

app.get('/api/sensors/:id', async (req, res) => {
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

app.put('/api/sensors/:id', async (req, res) => {
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

app.delete('/api/sensors/:id', async (req, res) => {
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

// Existing Sensor Routes
app.get('/api/sensor-data', async (req, res) => {
  try {
    const sensorData = await blynkService.getSensorData();

    res.json(sensorData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Control pump
app.post('/api/pump', async (req, res) => {
  try {
    const { status, targetMoisture, farmId } = req.body;
    const action = status ? true : false;
    const result = await blynkService.controlPump(action, targetMoisture);
    
    // Save pump status to irrigation data
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

app.post('/api/blynk/controlPump', async (req, res) => {
  try {
    const { action, targetMoisture, farmId, duration } = req.body;
    if (action === undefined) {
      return res.status(400).json({ error: 'Action is required' });
    }
    const result = await blynkService.controlPump(action, targetMoisture, duration || 0);
    
    // Save to irrigation data if farmId provided
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

app.post('/api/blynk/setTargetMoisture', async (req, res) => {
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


app.get('/api/blynk/deviceStatus', async (req, res) => {
  try {
    const status = await blynkService.checkDeviceConnection();
    res.json(status);
  } catch (error) {
    console.error('Error checking device status:', error);
    res.status(500).json({ error: 'Failed to check device status' });
  }
});

app.get('/api/blynk/dashboard-data', async (req, res) => {
  try {
    const { city = 'Udaipur' } = req.query;
    const dashboardData = await blynkService.getDashboardData(city);
    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/blynk/pump/control', async (req, res) => {
  try {
    const { action, targetMoisture, farmId, duration } = req.body;
    const result = await blynkService.controlPump(action, targetMoisture, duration);
    
    // Save to irrigation data if farmId provided
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





  // Temporary test route for SensorData validation
  app.post('/api/test-save-sensor', async (req, res) => {
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

  app.get('/',(req,res)=>{
    res.send("Hello server")
  })

  app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
  });