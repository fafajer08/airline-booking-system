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
      required: true } // Duration in minutes
});

module.exports = mongoose.model('Route', routeSchema);
