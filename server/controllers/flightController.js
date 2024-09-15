const Flight = require('../models/Flight'); // Adjust the path according to your project structure

// Controller for Flight Operations
const FlightController = {
  
  // Add a new flight
  async addFlight(req, res) {
    try {
      const { flightNo, airplane, route, day, time } = req.body;

      // Validate required fields
      if (!flightNo || !airplane || !route || !day || !time) {
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
        const populatedFlight = await Flight.findById(savedFlight._id)
        .populate({
            path: 'airplane',
        })
        .populate({
            path: 'route',
            populate: [
            { path: 'departure', model: 'Airport' },
            { path: 'destination', model: 'Airport' },
    ],
  });
res.status(201).json(populatedFlight);
    } catch (error) {
      console.error("Error adding flight:", error);
      res.status(500).json({ message: 'Error adding flight', error });
    }
  },

  // Edit an existing flight by _id
  async editFlight(req, res) {
    try {
      const { id } = req.params; // Use _id
      const updates = req.body;

      const updatedFlight = await Flight.findByIdAndUpdate(id, updates, { new: true });
      if (!updatedFlight) {
        return res.status(404).json({ message: 'Flight not found' });
      }
      res.status(200).json(updatedFlight);
    } catch (error) {
      res.status(500).json({ message: 'Error editing flight', error });
    }
  },

  // Archive a flight by _id (soft delete, using an `isActive` flag)
  async archiveFlight(req, res) {
    try {
      const { id } = req.params; // Use _id

      const updatedFlight = await Flight.findByIdAndUpdate(
        id,
        { isActive: false }, // Set the flight as inactive
        { new: true }
      );

      if (!updatedFlight) {
        return res.status(404).json({ message: 'Flight not found' });
      }

      res.status(200).json({ message: 'Flight archived successfully', updatedFlight });
    } catch (error) {
      console.error('Error archiving flight:', error);
      res.status(500).json({ message: 'Error archiving flight', error });
    }
  },

  // Activate a flight by _id (set `isActive` flag to true)
  async activateFlight(req, res) {
    try {
      const { id } = req.params; // Use _id

      const updatedFlight = await Flight.findByIdAndUpdate(
        id,
        { isActive: true }, // Set the flight as active
        { new: true }
      );

      if (!updatedFlight) {
        return res.status(404).json({ message: 'Flight not found' });
      }

      res.status(200).json({ message: 'Flight activated successfully', updatedFlight });
    } catch (error) {
      res.status(500).json({ message: 'Error activating flight', error });
    }
  },

  // Get flight details by _id
  async getFlightDetails(req, res) {
    try {
      const { id } = req.params; // Use _id

      const flight = await Flight.findById(id).populate('airplane route'); // Populate airplane and route details
      if (!flight) {
        return res.status(404).json({ message: 'Flight not found' });
      }

      res.status(200).json(flight);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching flight details', error });
    }
  },

  // View all flights
  async viewAllFlights(req, res) {
    try {
      console.log('Fetching all flights...'); // Log the start of the operation
  
      const flights = await Flight.find({})
      .populate('airplane') // Populate airplane details
      .populate({
        path: 'route',
        populate: [
          { path: 'departure', model: 'Airport' }, // Populate departure airport details
          { path: 'destination', model: 'Airport' } // Populate destination airport details
        ]
      });// Populate airplane and route details
      // console.log('Fetched flights:', flights); // Log the fetched flights
  
      if (!flights || flights.length === 0) {
        console.log('No flights found'); // Log when no flights are found
        return res.status(404).json({ message: 'No flights found' });
      }
  
      res.status(200).json(flights);
    } catch (error) {
      console.error('Error fetching flights:', error); // Log the error details
      res.status(500).json({ message: 'Error fetching flights', error });
    }
  }
}

module.exports = FlightController;
