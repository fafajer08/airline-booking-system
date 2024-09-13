const Airplane = require('../models/Airplane'); // Adjust the path according to your project structure

// Controller for Plane Operations
const AirplaneController = {

  // Add a new plane
  async addAirplane(req, res) {
    try {
      const { planeId, brand, model, airlineName, totalSeats, economySeat, premiumSeat, businessSeat, firstClass } = req.body;

      const newPlane = new Plane({
        planeId,
        brand,
        model,
        airlineName,
        totalSeats,
        economySeat,
        premiumSeat,
        businessSeat,
        firstClass
      });

      const savedPlane = await newPlane.save();
      res.status(201).json(savedPlane);
    } catch (error) {
      res.status(500).json({ message: 'Error adding plane', error });
    }
  },

  // Edit an existing plane by _id
  async editAirplane(req, res) {
    try {
      const { id } = req.params; // Use _id
      const updates = req.body;

      const updatedPlane = await Plane.findByIdAndUpdate(id, updates, { new: true });
      if (!updatedPlane) {
        return res.status(404).json({ message: 'Plane not found' });
      }
      res.status(200).json(updatedPlane);
    } catch (error) {
      res.status(500).json({ message: 'Error editing plane', error });
    }
  },

  // Archive a plane by _id (soft delete, using an `isActive` flag)
  async archiveAirplane(req, res) {
    try {
      const { id } = req.params; // Use _id
      const updatedPlane = await Plane.findByIdAndUpdate(
        id,
        { isActive: false }, // Set the plane as inactive
        { new: true }
      );

      if (!updatedPlane) {
        return res.status(404).json({ message: 'Plane not found' });
      }
      res.status(200).json({ message: 'Plane archived successfully', updatedPlane });
    } catch (error) {
      res.status(500).json({ message: 'Error archiving plane', error });
    }
  },

  // Activate a plane by _id (set `isActive` flag to true)
  async activateAirplane(req, res) {
    try {
      const { id } = req.params; // Use _id
      const updatedPlane = await Plane.findByIdAndUpdate(
        id,
        { isActive: true }, // Set the plane as active
        { new: true }
      );

      if (!updatedPlane) {
        return res.status(404).json({ message: 'Plane not found' });
      }
      res.status(200).json({ message: 'Plane activated successfully', updatedPlane });
    } catch (error) {
      res.status(500).json({ message: 'Error activating plane', error });
    }
  },

  // Get plane details by _id
  async getAirplaneDetails(req, res) {
    try {
      const { id } = req.params; // Use _id

      const plane = await Plane.findById(id);

      if (!plane) {
        return res.status(404).json({ message: 'Plane not found' });
      }
      res.status(200).json(plane);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching plane details', error });
    }
  },

  // View all planes
  async viewAllAirplanes(req, res) {
    try {

      console.log('Fetching all Airplanes...');
      // Query the database and log the raw result
      const airplanes = await Airplane.find({});
      console.log('Raw Airplanes data:', airplanes);

  
      if (!airplanes || airplanes.length === 0) {
        console.log('No Airplanes found');
        return res.status(404).json({ message: 'No airplanes found' });
      }
  
      res.status(200).json(airplanes);
    } catch (error) {
      console.error('Error fetching Airplanes:', error);
      res.status(500).json({ message: 'Error fetching planes', error });
    }
  }
  
  
};

module.exports = AirplaneController;
