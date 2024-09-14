const express = require('express');
const router = express.Router();
const airplaneController = require('../controllers/airplaneController');
const {  isLoggedIn } = require("../auth");

//add v

// Route to add a new plane
router.post('/', airplaneController.addAirplane);
router.put('/:id', airplaneController.editAirplane); // For editing
router.patch('/:id/archive/', airplaneController.archiveAirplane); // For archiving
router.patch('/:id/activate/', airplaneController.activateAirplane); // For activating
router.get('/all', airplaneController.viewAllAirplanes); // For viewing all planes
router.get('/:id', airplaneController.getAirplaneDetails); // For fetching details



module.exports = router;
