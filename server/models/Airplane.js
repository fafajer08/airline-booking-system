const mongoose = require('mongoose');

const airplaneSchema = new mongoose.Schema({
  planeId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  airlineName: {
    type: String,
    required: true,
    trim: true
  },
  totalSeats: {
    type: Number,
    required: true
  },
  economySeat: {
    type: Number,
    required: true
  },
  premiumSeat: {
    type: Number,
    required: true
  },
  businessSeat: {
    type: Number,
    required: true
  },
  firstClass: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true  // Set default value to true
  }
}, { timestamps: true });

const Airplane = mongoose.model('Airplane', airplaneSchema);

module.exports = Airplane;
