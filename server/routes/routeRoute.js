const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { isLoggedIn } = require("../auth");


router.post('/', routeController.addRoute);
router.put('/:id', routeController.editRoute);
router.patch('/archive/:id', routeController.archiveRoute);
router.patch('/activate/:id', routeController.activateRoute);
router.get('/all', routeController.viewAllRoutes);
router.get('/:id', routeController.getRouteDetails);

module.exports = router;
