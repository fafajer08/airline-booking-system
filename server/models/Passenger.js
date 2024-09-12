const scheduleSchema = new mongoose.Schema({
  dayOfWeek: { type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], required: true },
  departureTime: { type: String, required: true }, // Use a string to store "HH:mm" time format
  arrivalTime: { type: String, required: true },
  // Optionally store date-specific overrides
  departureDate: { type: Date },  // If you need date-specific overrides
});const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({

  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  nationality: {
    type: String,
    required: true,
    trim: true
  },
  passportNo: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  birthday: {
    type: Date,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phoneNo: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

const Passenger = mongoose.model('Passenger', passengerSchema);

module.exports = Passenger;
