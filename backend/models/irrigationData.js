const mongoose = require('mongoose');

const irrigationDataSchema = new mongoose.Schema({
    pumpData: {
        type: Boolean,
        required: true,
        default: false
    },
    targetMoisture: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('IrrigationData', irrigationDataSchema);