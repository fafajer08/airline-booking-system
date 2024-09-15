const mongoose = require('mongoose'); // Import mongoose to use ObjectId validation
const Flight = require('../models/Flight'); // Ad

// Controller for Flight Operations
const FlightController = {
  
  // Add a new flight
  async addFlight(req, res) {
    try {
      const { flightNo, airplane, route, day, time } = req.body;
      console.log('Add Flight Request:', req.body); // Debugging input data

      // Validate required fields
      if (!flightNo || !airplane || !route || !day || !time) {
        console.log('Missing required fields'); // Debugging
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const newFlight = new Flight({
        flightNo,
        airplane,
        route,
        day,
        time
      });

      const savedFlight = await newFlight.save();
      console.log('Saved Flight:', savedFlight); // Debugging saved flight

      const populatedFlight = await Flight.findById(savedFlight._id)
        .populate('airplane')
        .populate({
          path: 'route',
          populate: [
            { path: 'departure', model: 'Airport' },
            { path: 'destination', model: 'Airport' },
          ],
        });

      console.log('Populated Flight:', populatedFlight); // Debugging populated flight
      res.status(201).json(populatedFlight);
    } catch (error) {
      console.error('Error adding flight:', error);
      res.status(500).json({ message: 'Error adding flight', error });
    }
  },

  // Edit an existing flight by _id
  async editFlight(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      console.log('Edit Flight ID:', id); // Debugging flight ID
      console.log('Edit Flight Updates:', updates); // Debugging updates

      const updatedFlight = await Flight.findByIdAndUpdate(id, updates, { new: true });
      if (!updatedFlight) {
        console.log('Flight not found:', id); // Debugging
        return res.status(404).json({ message: 'Flight not found' });
      }

      console.log('Updated Flight:', updatedFlight); // Debugging updated flight
      res.status(200).json(updatedFlight);
    } catch (error) {
      console.error('Error editing flight:', error);
      res.status(500).json({ message: 'Error editing flight', error });
    }
  },

  // Archive a flight by _id (soft delete, using an `isActive` flag)
  async archiveFlight(req, res) {
    try {
      const { id } = req.params;
      console.log('Archive Flight ID:', id); // Debugging flight ID

      const updatedFlight = await Flight.findByIdAndUpdate(
        id,
        { isActive: false }, // Set the flight as inactive
        { new: true }
      );

      if (!updatedFlight) {
        console.log('Flight not found:', id); // Debugging
        return res.status(404).json({ message: 'Flight not found' });
      }

      console.log('Archived Flight:', updatedFlight); // Debugging archived flight
      res.status(200).json({ message: 'Flight archived successfully', updatedFlight });
    } catch (error) {
      console.error('Error archiving flight:', error);
      res.status(500).json({ message: 'Error archiving flight', error });
    }
  },

  // Activate a flight by _id (set `isActive` flag to true)
  async activateFlight(req, res) {
    try {
      const { id } = req.params;
      console.log('Activate Flight ID:', id); // Debugging flight ID

      const updatedFlight = await Flight.findByIdAndUpdate(
        id,
        { isActive: true }, // Set the flight as active
        { new: true }
      );

      if (!updatedFlight) {
        console.log('Flight not found:', id); // Debugging
        return res.status(404).json({ message: 'Flight not found' });
      }

      console.log('Activated Flight:', updatedFlight); // Debugging activated flight
      res.status(200).json({ message: 'Flight activated successfully', updatedFlight });
    } catch (error) {
      console.error('Error activating flight:', error);
      res.status(500).json({ message: 'Error activating flight', error });
    }
  },

  // Get flight details by _id
  async getFlightDetails(req, res) {
    try {
      const { id } = req.params;
      console.log('Get Flight Details ID:', id); // Debugging flight ID
  
      // Validate if `id` is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log('Invalid ObjectId:', id); // Debugging invalid ObjectId
        return res.status(400).json({ message: 'Invalid flight ID' });
      }
  
      const flight = await Flight.findById(id).populate('airplane route');
      if (!flight) {
        console.log('Flight not found:', id); // Debugging
        return res.status(404).json({ message: 'Flight not found' });
      }
  
      console.log('Flight Details:', flight); // Debugging flight details
      res.status(200).json(flight);
    } catch (error) {
      console.error('Error fetching flight details:', error);
      res.status(500).json({ message: 'Error fetching flight details', error });
    }
  },

  // View all flights
  async viewAllFlights(req, res) {
    try {
      console.log('Fetching all flights...'); // Log the start of the operation
  
      const flights = await Flight.find({})
        .populate('airplane')
        .populate({
          path: 'route',
          populate: [
            { path: 'departure', model: 'Airport' },
            { path: 'destination', model: 'Airport' }
          ]
        });

      console.log('Fetched Flights:', flights.length); // Debugging number of flights

      if (!flights || flights.length === 0) {
        console.log('No flights found'); // Debugging
        return res.status(404).json({ message: 'No flights found' });
      }
  
      res.status(200).json(flights);
    } catch (error) {
      console.error('Error fetching flights:', error);
      res.status(500).json({ message: 'Error fetching flights', error });
    }
  },

  // Get all unique airports (name, code, city) used as departure and destination
  async getAllAirports(req, res) {
    try {
      console.log('Fetching all airports...'); // Debugging
  
      // Fetch flights with populated route details (departure and destination airports)
      const flights = await Flight.find({})
        .populate({
          path: 'route',
          populate: [
            { path: 'departure', model: 'Airport' },
            { path: 'destination', model: 'Airport' }
          ]
        });
  
      console.log('Total Flights Found for Airport Extraction:', flights.length); // Debugging
  
      // Extract departure and destination airports into an array
      const airports = [];
  
      flights.forEach(flight => {
        if (flight.route.departure) {
          airports.push({
            name: flight.route.departure.airportName,
            code: flight.route.departure.airportCode,
            city: flight.route.departure.airportCity
          });
        }
        if (flight.route.destination) {
          airports.push({
            name: flight.route.destination.airportName,
            code: flight.route.destination.airportCode,
            city: flight.route.destination.airportCity
          });
        }
      });
  
      console.log('Total Airports Extracted:', airports.length); // Debugging
  
      // Remove duplicates based on code, as it uniquely identifies each airport
      const uniqueAirports = airports.filter(
        (airport, index, self) =>
          index === self.findIndex((a) => a.code === airport.code)
      );
  
      console.log('Unique Airports:', uniqueAirports.length); // Debugging unique airports
  
      // Sort unique airports by city
      uniqueAirports.sort((a, b) => a.city.localeCompare(b.city));
  
      console.log('Sorted Airports:', uniqueAirports); // Debugging sorted airports
  
      res.status(200).json(uniqueAirports);
    } catch (error) {
      console.error('Error fetching airports:', error);
      res.status(500).json({ message: 'Error fetching airports', error });
    }
  }
  
};

module.exports = FlightController;
