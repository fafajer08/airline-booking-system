const Plane = require('../models/Plane'); // Adjust the path according to your project structure

// Controller for Plane Operations
const PlaneController = {

  // Add a new plane
  async addPlane(req, res) {
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
  async editPlane(req, res) {
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
  async archivePlane(req, res) {
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
  async activatePlane(req, res) {
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
  async getPlaneDetails(req, res) {
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
  async viewAllPlanes(req, res) {
    try {

      
      // Query the database and log the raw result
      const planes = await Plane.find({});

  
      if (!planes || planes.length === 0) {

        return res.status(404).json({ message: 'No planes found' });
      }
  
      res.status(200).json(planes);
    } catch (error) {

      res.status(500).json({ message: 'Error fetching planes', error });
    }
  }
  
  
};

module.exports = PlaneController;
