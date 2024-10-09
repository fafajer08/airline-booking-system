// models/route.js
const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    departure: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Airport', 
      required: true },

    departureAirportName: {
        type: String,
        required: true,
        trim: true
    },
    departureAirportCode: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 3
    },
    departureAirportCity: {
        type: String,
        required: true,
        trim: true
    },
    departureAirportCountry: {
        type: String,
        required: true,
        trim: true
    },
    destination: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Airport', 
      required: true },

    destinationAirportName: {
      type: String,
      required: true,
      trim: true
    },
    destinationAirportCode: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 3
    },
    destinationAirportCity: {
        type: String,
        required: true,
        trim: true
    },
    destinationAirportCountry: {
        type: String,
        required: true,
        trim: true
    },
    distanceKM: { 
      type: Number, 
      required: true }, // Distance in kilometers
    durationMins: { 
      type: Number, 
      required: true },
    isActive: {
      type: Boolean,
      default: true  // Set default value to true
    } // Duration in minutes
}, { timestamps: true });

module.exports = mongoose.model('Route', routeSchema);
