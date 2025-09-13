const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
  farmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  moisture1: {
    type: Number,
    required: true
  },
  moisture2: {
    type: Number,
    required: true
  },
  temperature: {
    type: Number,
    required: true
  },
  humidity: {
    type: Number,
    required: true
  },
  tankLevel: {
    type: Number,
    required: true
  },
  pumpStatus: {
    type: Boolean,
    default: false
  },
  isRain: {
    type: Number,
    default: 0
  },
  physicalBtn: {
    type: Number,
    default: 0
  },
  pumpControl: {
    type: Number,
    default: 0
  },
  targetMoisture: {
    type: Number,
    default: 30
  },
  serverStatus:{
    type: Number,
    default:0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SensorData', sensorDataSchema);