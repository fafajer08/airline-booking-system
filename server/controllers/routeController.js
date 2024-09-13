const Route = require('../models/route');
const Airport = require('../models/Airport'); // Adjust the path according to your project structure

const routeController = {

  // Add a new route
  async addRoute(req, res) { 
    try {
      const { departure, destination, distanceKM, durationMins } = req.body;

      // Validate airports
      const departureAirport = await Airport.findById(departure);
      const destinationAirport = await Airport.findById(destination);

      if (!departureAirport || !destinationAirport) {
        return res.status(404).json({ message: 'Departure or destination airport not found' });
      }

      const newRoute = new Route({
        departure,
        destination,
        distanceKM,
        durationMins
      });

      const savedRoute = await newRoute.save();
      res.status(201).json(savedRoute);
    } catch (error) {
      res.status(500).json({ message: 'Error adding route', error });
    }
  },

  // Edit an existing route by ID
  async editRoute(req, res) {
    try {
      const { id } = req.params; // Use _id
      const updates = req.body;

      const updatedRoute = await Route.findByIdAndUpdate(id, updates, { new: true });
      if (!updatedRoute) {
        return res.status(404).json({ message: 'Route not found' });
      }
      res.status(200).json(updatedRoute);
    } catch (error) {
      res.status(500).json({ message: 'Error editing route', error });
    }
  },

  // Archive a route by ID (soft delete, using an `isActive` flag)
  async archiveRoute(req, res) {
    try {
      const { id } = req.params; // Use _id
      const updatedRoute = await Route.findByIdAndUpdate(
        id,
        { isActive: false }, // Set the route as inactive
        { new: true }
      );

      if (!updatedRoute) {
        return res.status(404).json({ message: 'Route not found' });
      }
      res.status(200).json({ message: 'Route archived successfully', updatedRoute });
    } catch (error) {
      res.status(500).json({ message: 'Error archiving route', error });
    }
  },

  // Activate a route by ID (set `isActive` flag to true)
  async activateRoute(req, res) {
    try {
      const { id } = req.params; // Use _id
      const updatedRoute = await Route.findByIdAndUpdate(
        id,
        { isActive: true }, // Set the route as active
        { new: true }
      );

      if (!updatedRoute) {
        return res.status(404).json({ message: 'Route not found' });
      }
      res.status(200).json({ message: 'Route activated successfully', updatedRoute });
    } catch (error) {
      res.status(500).json({ message: 'Error activating route', error });
    }
  },

  // View all routes
  async viewAllRoutes(req, res) {
    try {
      console.log('Fetching all Routes...');
      const routes = await Route.find().populate('departure').populate('destination');
      console.log('Raw Routes data:', routes);
      
      if (!routes || routes.length === 0) {
        return res.status(404).json({ message: 'No routes found' });
      }
      res.status(200).json(routes);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching routes', error });
    }
  },

  // Get route details by ID
  async getRouteDetails(req, res) {
    try {
      const { id } = req.params; // Use _id

      const route = await Route.findById(id).populate('departure').populate('destination');

      if (!route) {
        return res.status(404).json({ message: 'Route not found' });
      }
      res.status(200).json(route);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching route details', error });
    }
  }
};

module.exports = routeController;
