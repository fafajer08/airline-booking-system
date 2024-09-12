const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { isLoggedIn } = require("../auth");

// Route to add a new route
router.post('/', routeController.addRoute);

// Route to edit an existing route by ID
router.put('/:id', routeController.editRoute);

// Route to archive a route by ID
router.patch('/archive/:id', routeController.archiveRoute);

// Route to activate a route by ID
router.patch('/activate/:id', routeController.activateRoute);

// Route to get all routes
router.get('/all', routeController.viewAllRoutes);

// Route to get route details by ID
router.get('/:id', routeController.getRouteDetails);

module.exports = router;
