const express = require('express');
const router = express.Router();
const commercialFlightController = require('../controllers/commercialFlightController');

// Route to add a new commercial flight
router.post('/', commercialFlightController.addCommercialFlight);

router.post('/multiple', commercialFlightController.addMultipleCommercialFlights);

// Route to edit an existing commercial flight
router.put('/:id', commercialFlightController.editCommercialFlight);

// Route to archive (deactivate) a commercial flight
router.patch('/:id/archive', commercialFlightController.archiveCommercialFlight);

// Route to activate a commercial flight
router.patch('/:id/activate', commercialFlightController.activateCommercialFlight);

// Route to cancel a commercial flight
router.patch('/:id/cancel', commercialFlightController.cancelCommercialFlight);

// Route to mark a commercial flight as done
router.patch('/:id/mark-done', commercialFlightController.markCommercialFlightDone);

// Route to view all commercial flights
router.get('/all', commercialFlightController.viewAllCommercialFlights);

// Route to get details of a specific commercial flight
router.get('/:id', commercialFlightController.getCommercialFlightDetails);

module.exports = router;
