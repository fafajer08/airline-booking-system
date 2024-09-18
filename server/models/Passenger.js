const mongoose = require('mongoose');

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
    trim: true

  },
  birthday: {
    type: Date,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phoneNo: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

// Create a compound index on firstName, lastName, and birthday
passengerSchema.index({ firstName: 1, lastName: 1, birthday: 1 });

const Passenger = mongoose.model('Passenger', passengerSchema);

module.exports = Passenger;
