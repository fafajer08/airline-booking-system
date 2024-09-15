const CommercialFlight = require('../models/CommercialFlight');

const commercialFlightController = {
  // Add a new commercial flight with unique check
  async addCommercialFlight(req, res) {
    try {
      console.log('Received request to add commercial flight:', req.body); // Debugging

      const { flight, pricing, date, departureTime, bookings } = req.body;

      if (!flight || !pricing || !date || !departureTime) {
        console.log('Missing required fields:', { flight, pricing, date, departureTime }); // Debugging
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Check if a commercial flight with the same flight, date, and departureTime already exists
      const existingFlight = await CommercialFlight.findOne({ flight, date, departureTime });
      if (existingFlight) {
        console.log('Commercial flight already exists:', existingFlight); // Debugging
        return res.status(400).json({ message: 'Commercial flight already exists', id: existingFlight._id });
      }

      // Create a new commercial flight if not already existing
      const newCommercialFlight = new CommercialFlight({
        flight,
        pricing,
        date,
        departureTime,
        bookings: bookings || [], // Initialize with an empty array if bookings are not provided
      });

      const savedCommercialFlight = await newCommercialFlight.save();
      console.log('New commercial flight saved:', savedCommercialFlight); // Debugging

      res.status(201).json(savedCommercialFlight);
    } catch (error) {
      console.error('Error adding commercial flight:', error); // Debugging
      if (error.code === 11000) { // Handle duplicate key error for unique index
        res.status(400).json({ message: 'Commercial flight with the same flight, date, and departure time already exists' });
      } else {
        res.status(500).json({ message: 'Error adding commercial flight', error });
      }
    }
  },

  // Add multiple commercial flights
  async addMultipleCommercialFlights(req, res) {
    try {
      console.log('Received request to add multiple commercial flights:', req.body); // Debugging

      const flightsToAdd = req.body.flights; // Assuming the array is sent as `flights`
      if (!Array.isArray(flightsToAdd) || flightsToAdd.length === 0) {
        return res.status(400).json({ message: 'No flights provided' });
      }

      const newFlights = [];
      const alreadyExist = [];

      // Check each flight to see if it already exists
      for (const flightData of flightsToAdd) {
        const { flightId, priceId, date, departureTime } = flightData;

        const existingFlight = await CommercialFlight.findOne({ flight: flightId._id, date, departureTime });
        if (existingFlight) {
          // If the flight already exists, add it to the alreadyExist array
          alreadyExist.push({ id: existingFlight._id, flight: flightId._id, date, departureTime });
        } else {
          // If the flight does not exist, prepare it to be added to the database
          newFlights.push({
            flight: flightId._id,
            pricing: priceId,
            date,
            departureTime,
          });
        }
      }

      // Add new flights to the database
      let savedCommercialFlights = [];
      if (newFlights.length > 0) {
        savedCommercialFlights = await CommercialFlight.insertMany(newFlights);
        console.log('New commercial flights saved:', savedCommercialFlights); // Debugging
      } else {
        console.log('No new commercial flights to add'); // Debugging
      }

      // Return the added and already existing flights in the response
      res.status(201).json({
        added: savedCommercialFlights,
        alreadyExist: alreadyExist
      });
    } catch (error) {
      console.error('Error adding multiple commercial flights:', error); // Debugging
      res.status(500).json({ message: 'Error adding multiple commercial flights', error });
    }
  },

  async editCommercialFlight(req, res) {
    try {
      console.log('Received request to edit commercial flight:', req.params.id, req.body); // Debugging
      const { id } = req.params;
      const updates = req.body;

      const updatedCommercialFlight = await CommercialFlight.findByIdAndUpdate(id, updates, { new: true });
      if (!updatedCommercialFlight) {
        console.log('Commercial flight not found:', id); // Debugging
        return res.status(404).json({ message: 'Commercial flight not found' });
      }

      console.log('Commercial flight updated:', updatedCommercialFlight); // Debugging
      res.status(200).json(updatedCommercialFlight);
    } catch (error) {
      console.error('Error editing commercial flight:', error); // Debugging
      res.status(500).json({ message: 'Error editing commercial flight', error });
    }
  },

  // Archive (deactivate) a commercial flight
  async archiveCommercialFlight(req, res) {
    try {
      console.log('Received request to archive commercial flight:', req.params.id); // Debugging
      const { id } = req.params;

      const updatedCommercialFlight = await CommercialFlight.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!updatedCommercialFlight) {
        console.log('Commercial flight not found:', id); // Debugging
        return res.status(404).json({ message: 'Commercial flight not found' });
      }

      console.log('Commercial flight archived:', updatedCommercialFlight); // Debugging
      res.status(200).json({ message: 'Commercial flight archived successfully', updatedCommercialFlight });
    } catch (error) {
      console.error('Error archiving commercial flight:', error); // Debugging
      res.status(500).json({ message: 'Error archiving commercial flight', error });
    }
  },

  // Activate a commercial flight
  async activateCommercialFlight(req, res) {
    try {
      console.log('Received request to activate commercial flight:', req.params.id); // Debugging
      const { id } = req.params;

      const updatedCommercialFlight = await CommercialFlight.findByIdAndUpdate(
        id,
        { isActive: true },
        { new: true }
      );

      if (!updatedCommercialFlight) {
        console.log('Commercial flight not found:', id); // Debugging
        return res.status(404).json({ message: 'Commercial flight not found' });
      }

      console.log('Commercial flight activated:', updatedCommercialFlight); // Debugging
      res.status(200).json({ message: 'Commercial flight activated successfully', updatedCommercialFlight });
    } catch (error) {
      console.error('Error activating commercial flight:', error); // Debugging
      res.status(500).json({ message: 'Error activating commercial flight', error });
    }
  },

  // Cancel a commercial flight
  async cancelCommercialFlight(req, res) {
    try {
      console.log('Received request to cancel commercial flight:', req.params.id); // Debugging
      const { id } = req.params;

      const updatedCommercialFlight = await CommercialFlight.findByIdAndUpdate(
        id,
        { isCancelled: true },
        { new: true }
      );

      if (!updatedCommercialFlight) {
        console.log('Commercial flight not found:', id); // Debugging
        return res.status(404).json({ message: 'Commercial flight not found' });
      }

      console.log('Commercial flight cancelled:', updatedCommercialFlight); // Debugging
      res.status(200).json({ message: 'Commercial flight cancelled successfully', updatedCommercialFlight });
    } catch (error) {
      console.error('Error cancelling commercial flight:', error); // Debugging
      res.status(500).json({ message: 'Error cancelling commercial flight', error });
    }
  },

  // Mark a commercial flight as done
  async markCommercialFlightDone(req, res) {
    try {
      console.log('Received request to mark commercial flight as done:', req.params.id); // Debugging
      const { id } = req.params;

      const updatedCommercialFlight = await CommercialFlight.findByIdAndUpdate(
        id,
        { isDone: true },
        { new: true }
      );

      if (!updatedCommercialFlight) {
        console.log('Commercial flight not found:', id); // Debugging
        return res.status(404).json({ message: 'Commercial flight not found' });
      }

      console.log('Commercial flight marked as done:', updatedCommercialFlight); // Debugging
      res.status(200).json({ message: 'Commercial flight marked as done successfully', updatedCommercialFlight });
    } catch (error) {
      console.error('Error marking commercial flight as done:', error); // Debugging
      res.status(500).json({ message: 'Error marking commercial flight as done', error });
    }
  },

  // Get details of a specific commercial flight
  async getCommercialFlightDetails(req, res) {
    try {
      console.log('Received request to get commercial flight details:', req.params.id); // Debugging
      const { id } = req.params;

      const commercialFlight = await CommercialFlight.findById(id).populate('flight pricing bookings');

      if (!commercialFlight) {
        console.log('Commercial flight not found:', id); // Debugging
        return res.status(404).json({ message: 'Commercial flight not found' });
      }

      console.log('Commercial flight details:', commercialFlight); // Debugging
      res.status(200).json(commercialFlight);
    } catch (error) {
      console.error('Error fetching commercial flight details:', error); // Debugging
      res.status(500).json({ message: 'Error fetching commercial flight details', error });
    }
  },

  // View all commercial flights
  async viewAllCommercialFlights(req, res) {
    try {
      console.log('Received request to view all commercial flights'); // Debugging

      const commercialFlights = await CommercialFlight.find({}).populate('flight pricing bookings');

      if (!commercialFlights || commercialFlights.length === 0) {
        console.log('No commercial flights found'); // Debugging
        return res.status(404).json({ message: 'No commercial flights found' });
      }

      console.log('All commercial flights:', commercialFlights); // Debugging
      res.status(200).json(commercialFlights);
    } catch (error) {
      console.error('Error fetching commercial flights:', error); // Debugging
      res.status(500).json({ message: 'Error fetching commercial flights', error });
    }
  }
};

module.exports = commercialFlightController;
