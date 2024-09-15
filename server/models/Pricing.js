const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
  priceName: {
    type: String,
    required: true,
    trim: true
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  distanceFactor: {
    type: Number,
    required: true,
    min: 0
  },
  firstClassFactor: {
    type: Number,
    required: true,
    min: 0
  },
  businessFactor: {
    type: Number,
    required: true,
    min: 0
  },
  premiumFactor: {
    type: Number,
    required: true,
    min: 0
  },
  economyFactor: {
    type: Number,
    required: true,
    min: 0
  }
});

// Create the Pricing model
const Pricing = mongoose.model('Pricing', pricingSchema);

module.exports = Pricing;
