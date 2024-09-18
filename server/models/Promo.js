const mongoose = require('mongoose');

const promoSchema = new mongoose.Schema({
  promoName: {
    type: String,
    required: true,
    trim: true
  },
  promoCode: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  discount: {
    type: Number, // percentage discount (e.g., 20 for 20%)
    required: true,
    min: 0,
    max: 100,
  },
  absolutePricing: {
    type: Number, // absolute discount amount (if applicable)
    default: 0,
    min: 0,
  },
  promoStart: {
    type: Date,
    required: true,
    default: new Date(),
  },
  promoEnd: {
    type: Date,
    required: true,
  },
  numberOfSlots: {
    type: Number, // Number of times the promo can be used
    default: 0, // 0 for unlimited usage
    min: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields automatically
});

module.exports = mongoose.model('Promo', promoSchema);
