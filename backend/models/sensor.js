const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sensor name is required'],
    trim: true
  },
  farmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: [true, 'Farm ID is required']
  },
  type: {
    type: String,
    enum: ['moisture', 'temperature', 'humidity', 'tankLevel', 'pump', 'rain', 'button'],
    required: [true, 'Sensor type is required']
  },
  pin: {
    type: String,
    required: [true, 'Blynk pin is required'],
    match: [/^V[0-9]+$/, 'Pin must be in format V0, V1, etc.']
  },
  location: {
    type: String,
    trim: true
  },
  status: {
    type: Boolean,
    default: true
  },
  threshold: {
    type: Number,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Sensor', sensorSchema);