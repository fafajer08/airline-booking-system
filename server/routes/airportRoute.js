const express = require('express');
const router = express.Router();
const airportController = require('../controllers/airportController');
const { verify, verifyAdmin, isLoggedIn } = require("../auth");

//add v

// Route to add a new Airport
router.post('/', airportController.addAirport);
router.put('/:id', airportController.editAirport); // For editing
router.patch('/archive/:id', airportController.archiveAirport); // For archiving
router.patch('/activate/:id', airportController.activateAirport); // For activating
router.get('/all', airportController.viewAllAirports); // For viewing all Airports
router.get('/:id', airportController.getAirportDetails); // For fetching details



module.exports = router;
