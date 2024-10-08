const express = require('express');
const router = express.Router();
const passengerController = require('../controllers/passengerController');
const { verify, verifyAdmin, isLoggedIn } = require("../auth");

// Routes for Passenger operations
router.post('/addmultiple', passengerController.addOrGetMultiplePassengers);
router.post('/', passengerController.addPassenger); // Add a new passenger
router.put('/:id', passengerController.editPassenger); // Edit an existing passenger
router.get('/all', passengerController.viewAllPassengers); // View all passengers
router.get('/:id', passengerController.getPassengerDetails); // Get passenger details by ID
router.post('/checkadd', passengerController.checkAddPassenger); // Check a passenger

module.exports = router;
