const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  flightNo: { 
    type: String, 
    required: true 
  },
  airplane: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Airplane', 
    required: true 
  },
  route: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Route', 
    required: true 
  },
  day: {
    type: Number,
    required: true,
    min: 1,
    max: 7
  },
  time: {
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):[0-5]\d$/
  },
  isActive: {
    type: Boolean,
    default: true,
    required: true
  }
});

const Flight = mongoose.model('Flight', flightSchema);
module.exports = Flight;
