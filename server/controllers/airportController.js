const Airport = require('../models/Airport'); // Adjust the path according to your project structure

// Controller for Airport Operations
const AirportController = {

  // Add a new Airport
  async addAirport(req, res) {
    try {
      const { airportName, airportCode, airportCity, airportCountry } = req.body;
      console.log(req.body);

      const newAirport = new Airport({
        airportName,
        airportCode,
        airportCity,
        airportCountry
      });

      const savedAirport = await newAirport.save();
      res.status(201).json(savedAirport);
    } catch (error) {
      res.status(500).json({ message: 'Error adding Airport', error });
    }
  },

  // Edit an existing Airport by _id
  async editAirport(req, res) {
    try {
      const { id } = req.params; // Use _id
      const updates = req.body;

      const updatedAirport = await Airport.findByIdAndUpdate(id, updates, { new: true });
      if (!updatedAirport) {
        return res.status(404).json({ message: 'Airport not found' });
      }
      res.status(200).json(updatedAirport);
    } catch (error) {
      res.status(500).json({ message: 'Error editing Airport', error });
    }
  },

  // Archive a Airport by _id (soft delete, using an `isActive` flag)
  async archiveAirport(req, res) {
    try {
      const { id } = req.params; // Use _id
      const updatedAirport = await Airport.findByIdAndUpdate(
        id,
        { isActive: false }, // Set the Airport as inactive
        { new: true }
      );

      if (!updatedAirport) {
        return res.status(404).json({ message: 'Airport not found' });
      }
      res.status(200).json({ message: 'Airport archived successfully', updatedAirport });
    } catch (error) {
      res.status(500).json({ message: 'Error archiving Airport', error });
    }
  },

  // Activate a Airport by _id (set `isActive` flag to true)
  async activateAirport(req, res) {
    try {
      const { id } = req.params; // Use _id
      const updatedAirport = await Airport.findByIdAndUpdate(
        id,
        { isActive: true }, // Set the Airport as active
        { new: true }
      );

      if (!updatedAirport) {
        return res.status(404).json({ message: 'Airport not found' });
      }
      res.status(200).json({ message: 'Airport activated successfully', updatedAirport });
    } catch (error) {
      res.status(500).json({ message: 'Error activating Airport', error });
    }
  },

  // View all Airports
  async viewAllAirports(req, res) {
    try {
      console.log('Fetching all Airports...');
      
      // Query the database and log the raw result
      const airports = await Airport.find({});
      // console.log('Raw Airports data:', airports);
  
      if (!airports || airports.length === 0) {
        console.log('No Airports found');
        return res.status(404).json({ message: 'No Airports found' });
      }
  
      res.status(200).json(airports);
    } catch (error) {
      console.error('Error fetching Airports:', error);
      res.status(500).json({ message: 'Error fetching Airports', error });
    }
  },
  
    // Get Airport details by _id
    async getAirportDetails(req, res) {
        try {
          const { id } = req.params; // Use _id
    
          const airport = await Airport.findById(id);
    
          if (!airport) {
            return res.status(404).json({ message: 'airport not found' });
          }
          res.status(200).json(airport);
        } catch (error) {
          res.status(500).json({ message: 'Error fetching airport details', error });
        }
      }
  
};

module.exports = AirportController;
