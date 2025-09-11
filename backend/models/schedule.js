const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Schedule name is required'],
    trim: true
  },
  farmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: [true, 'Farm ID is required']
  },
  zone: {
    type: String,
    required: [true, 'Zone is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Active', 'Paused'],
    default: 'Active'
  },
  time: {
    type: String,
    required: [true, 'Schedule time (HH:MM) is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:MM']
  },
  duration: {
    type: Number,
    required: [true, 'Duration in minutes is required'],
    min: [1, 'Duration must be at least 1 minute']
  },
  days: {
    type: [Boolean],
    required: [true, 'Days of the week are required'],
    validate: {
      validator: function(v) {
        return v.length === 7;
      },
      message: 'Days must be an array of 7 booleans (Mon-Sun)'
    }
  },
  notes: {
    type: String,
    trim: true
  },
  nextRun: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Schedule', scheduleSchema);