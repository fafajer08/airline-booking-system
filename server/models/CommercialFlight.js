const mongoose = require('mongoose');

const commercialFlightSchema = new mongoose.Schema({
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
    required: true
  },
  pricing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pricing',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  departureTime: {
    type: Date,
    required: true
  },
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    default: []
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isCancelled: {
    type: Boolean,
    default: false
  },
  isDone: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create a unique compound index on flight, date, and departureTime
commercialFlightSchema.index({ flight: 1, date: 1, departureTime: 1 }, { unique: true });

module.exports = mongoose.model('CommercialFlight', commercialFlightSchema);
