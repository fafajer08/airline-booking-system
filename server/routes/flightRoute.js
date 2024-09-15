const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');
const { isLoggedIn } = require("../auth"); // Adjust this based on your project's structure


router.post('/', flightController.addFlight);
router.put('/:id', flightController.editFlight);
router.patch('/archive/:id', flightController.archiveFlight);
router.patch('/activate/:id', flightController.activateFlight);
router.get('/all', flightController.viewAllFlights);
router.get('/airports', flightController.getAllAirports)
router.get('/:id', flightController.getFlightDetails);


module.exports = router;
