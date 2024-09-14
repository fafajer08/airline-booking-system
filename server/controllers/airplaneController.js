const Airplane = require('../models/Airplane'); // Adjust the path according to your project structure

// Controller for Plane Operations
const AirplaneController = {

  // Add a new plane
  async addAirplane(req, res) {
    try {
        console.log("Request received:", req.body);  // Debugging: Log request body

        const { planeId, brand, model, airlineName, totalSeats, economySeat, premiumSeat, businessSeat, firstClass, isActive } = req.body;

        // Validate required fields
        if (!planeId || !brand || !model || !airlineName || !totalSeats) {
            console.error("Missing required fields");  // Debugging: Log missing fields
            return res.status(400).json({ message: 'Missing required fields' });
        }

        console.log("Creating new plane with the following details:", {
            planeId, brand, model, airlineName, totalSeats, economySeat, premiumSeat, businessSeat, firstClass
        });  // Debugging: Log plane details

        const newAirplane = new Airplane({
            planeId,
            brand,
            model,
            airlineName,
            totalSeats,
            economySeat,
            premiumSeat,
            businessSeat,
            firstClass,
            isActive // Ensure `isActive` is assigned
        });

        const savedAirplane = await newAirplane.save();

        console.log("Plane saved successfully:", savedAirplane);  // Debugging: Log saved plane details

        res.status(201).json(savedAirplane);
    } catch (error) {
        console.error("Error adding plane:", error);  // Debugging: Log the error
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
        //console.log("Archive request received with ID:", req.params.id);  // Debugging: Log the ID from request parameters

        const { id } = req.params; // Use _id

        //console.log("Attempting to archive plane with ID:", id);  // Debugging: Log the ID being used for update

        const updatedAirplane = await Airplane.findByIdAndUpdate(
            id,
            { isActive: false }, // Set the plane as inactive
            { new: true }
        );

        if (!updatedAirplane) {
            //console.error("Plane not found with ID:", id);  // Debugging: Log if the plane is not found
            return res.status(404).json({ message: 'Plane not found' });
        }

        //console.log("Plane archived successfully:", updatedAirplane);  // Debugging: Log the updated plane details

        res.status(200).json({ message: 'Plane archived successfully', updatedAirplane });
    } catch (error) {
        //console.error("Error archiving plane:", error);  // Debugging: Log the error
        res.status(500).json({ message: 'Error archiving plane', error });
    }
},


  // Activate a plane by _id (set `isActive` flag to true)
  async activateAirplane(req, res) {
    try {
      const { id } = req.params; // Use _id
      const updatedAirplane = await Airplane.findByIdAndUpdate(
        id,
        { isActive: true }, // Set the plane as active
        { new: true }
      );

      if (!updatedAirplane) {
        return res.status(404).json({ message: 'Plane not found' });
      }
      res.status(200).json({ message: 'Plane activated successfully', updatedAirplane });
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
      // console.log('Raw Airplanes data:', airplanes);

  
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
