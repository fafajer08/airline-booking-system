const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  flightNo: { 
    type: String, 
    required: true 
  },  // Flight number
  airline: {
    name: { type: String, required: true },  // Airline name
    code: { type: String, required: true },  // Airline code (e.g., FA)
    country: { type: String, required: true },  // Airline country (e.g., Philippines)
    planeId: { type: String, required: true },  // Plane identifier
    totalSeats: { type: Number, required: true }  // Total number of seats on the plane
  },
  departureAirport: {
    name: { type: String, required: true },  // Departure airport name
    code: { type: String, required: true },  // Airport code (e.g., MNL)
    city: { type: String, required: true },  // City of the departure airport
    country: { type: String, required: true }  // Country of the departure airport
  },
  destinationAirport: {
    name: { type: String, required: true },  // Destination airport name
    code: { type: String, required: true },  // Airport code (e.g., CEB)
    city: { type: String, required: true },  // City of the destination airport
    country: { type: String, required: true }  // Country of the destination airport
  },
  availableSeats: { 
    type: Number, 
    required: true 
  },  // Number of available seats for the flight
  bookedSeats: { 
    type: Number, 
  },  // Number of seats booked for the flight
  status: { 
    type: String, 
    enum: ['scheduled', 'ontime', 'delayed', 'cancelled'], 
    required: true 
  },  // Current status of the flight
  dayOfWeek: {
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    required: true
  },  // Day of the week when the flight is scheduled
  departureDate: { 
    type: Date, 
    required: true 
  },  // The specific date when the flight departs
  departureTime: { 
    type: String, 
    required: true 
  },  // Time of departure in HH:mm format
  arrivalTime: { 
    type: String, 
    required: true 
  }   // Time of arrival in HH:mm format
});

const Flight = mongoose.model('Flight', flightSchema);

module.exports = Flight;
