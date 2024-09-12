const mongoose = require('mongoose');

const airportSchema = new mongoose.Schema({
    airportName: {
        type: String,
        required: true,
        trim: true
    },
    airportCode: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    airportCity: {
        type: String,
        required: true,
        trim: true
    },
    airportCountry: {
        type: String,
        required: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
}, { timestamps: true });

const Airport = mongoose.model('Airport', airportSchema);

module.exports = Airport;
