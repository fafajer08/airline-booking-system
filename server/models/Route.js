// models/route.js
const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    departure: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Airport', 
      required: true },
    destination: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Airport', 
      required: true },
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
