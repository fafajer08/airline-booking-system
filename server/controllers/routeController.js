const Route = require('../models/Route');
const Airport = require('../models/Airport'); // Adjust the path according to your project structure

const routeController = {

  // Add a new route
  // async addRoute(req, res) { 
  //   try {
  //     const { departure, destination, distanceKM, durationMins } = req.body;
  
  //     // Validate airports
  //     const departureAirport = await Airport.findById(departure);
  //     const destinationAirport = await Airport.findById(destination);
  
  //     if (!departureAirport || !destinationAirport) {
  //       return res.status(404).json({ message: 'Departure or destination airport not found' });
  //     }
  
  //     const newRoute = new Route({
  //       departure,
  //       destination,
  //       distanceKM,
  //       durationMins
  //     });
  
  //     const savedRoute = await newRoute.save();
      
  //     // Populate the departure and destination fields
  //     const populatedRoute = await Route.findById(savedRoute._id)
  //       .populate('departure')
  //       .populate('destination');
  
  //     res.status(201).json(populatedRoute);
  //   } catch (error) {
  //     res.status(500).json({ message: 'Error adding route', error });
  //   }
  // },

  async addRoute(req, res) { 
    try {
      const { departure, destination, distanceKM, durationMins } = req.body;
  
      // Log the received request body
      console.log('Received addRoute request with body:', req.body);
  
      // Validate that departure and destination are not the same
      if (departure === destination) {
        console.log('Departure and destination airports are the same:', departure);
        return res.status(400).json({ message: 'Departure and destination airports cannot be the same' });
      }
  
      // Validate airports
      const departureAirport = await Airport.findById(departure);
      const destinationAirport = await Airport.findById(destination);
  
      // Log the fetched airports
      console.log('Fetched departure airport:', departureAirport);
      console.log('Fetched destination airport:', destinationAirport);
  
      if (!departureAirport || !destinationAirport) {
        console.log('One or both airports not found. Departure:', departureAirport, 'Destination:', destinationAirport);
        return res.status(404).json({ message: 'Departure or destination airport not found' });
      }
  
      // Construct the new route data based on the revised schema
      const newRouteData = {
        departure,
        departureAirportName: departureAirport.airportName,
        departureAirportCode: departureAirport.airportCode,
        departureAirportCity: departureAirport.airportCity,
        departureAirportCountry: departureAirport.airportCountry,
        destination,
        destinationAirportName: destinationAirport.airportName,
        destinationAirportCode: destinationAirport.airportCode,
        destinationAirportCity: destinationAirport.airportCity,
        destinationAirportCountry: destinationAirport.airportCountry,
        distanceKM,
        durationMins
      };
  
      // Log the data that will be used to create the new route
      console.log('Creating new route with data:', newRouteData);
  
      const newRoute = new Route(newRouteData);
  
      const savedRoute = await newRoute.save();
  
      // Log the saved route
      console.log('New route saved successfully:', savedRoute);
      
      // Populate the departure and destination fields
      const populatedRoute = await Route.findById(savedRoute._id)
        .populate('departure')
        .populate('destination');
  
      // Log the populated route
      console.log('Populated route after saving:', populatedRoute);
  
      res.status(201).json(populatedRoute);
    } catch (error) {
      // Log the error details
      console.error('Error adding route:', error);
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
      // console.log('Raw Routes data:', routes);
      
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
