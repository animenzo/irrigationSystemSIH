const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
  farmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  moisture: {
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
  // timestamp: {
  //   type: Date,
  //   default: Date.now
  // }
});

module.exports = mongoose.model('SensorData', sensorDataSchema);