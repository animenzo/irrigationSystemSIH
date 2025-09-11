const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Farm name is required'],
        trim: true
    },
    size_acres: {
        type: Number,
        required: [true, 'Farm size is required'],
        min: [0, 'Size must be positive']
    },
    location: {
        type: String,
        trim: true
    },
    current_crop: {
        type: String,
        required: [true, 'Current crop is required'],
        trim: true
    },
    coordinates: {
        lat: Number,
        lng: Number
    },
    tankDetails: {
        type: {
            type: String,
            enum: ['circle', 'rectangle'],
            trim: true
        },
        dimensions: {
            diameter: { type: Number, min: 0 },
            length: { type: Number, min: 0 },
            height: { type: Number, min: 0 }
        }
    },
    soilType: {
        type: String,
        trim: true
    },
    pincode: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                return v === '' || /^\d{6}$/.test(v);
            },
            message: 'Invalid pincode format'
        }
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    lastIrrigation: {
        type: Date,
        default: null
    },
    soilMoisture: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Farm', farmSchema);