const mongoose = require('mongoose');

const commercialFlightSchema = new mongoose.Schema(
  {
    flight: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Flight',
      required: true,
    },
    pricing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pricing',
      required: true,
    },
    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/, // Enforce "YYYY-MM-DD" format
    },
    departureTime: {
      type: String,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // Regex to match "HH:mm" format
    },
    bookings: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
      default: [],
    },
    availableSeats: {
      totalSeats: {
        type: Number,
        required: true,
      },
      economySeat: {
        type: Number,
        required: true,
      },
      premiumSeat: {
        type: Number,
        required: true,
      },
      businessSeat: {
        type: Number,
        required: true,
      },
      firstClass: {
        type: Number,
        required: true,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create a unique compound index on flight, date, and departureTime
commercialFlightSchema.index(
  { flight: 1, date: 1, departureTime: 1 },
  { unique: true }
);

module.exports = mongoose.model('CommercialFlight', commercialFlightSchema);
