const express = require('express');
const router = express.Router();
const planeController = require('../controllers/planeController');
const {  isLoggedIn } = require("../auth");

//add v

// Route to add a new plane
router.post('/', planeController.addPlane);
router.put('/:id', planeController.editPlane); // For editing
router.patch('/archive/:id', planeController.archivePlane); // For archiving
router.patch('/activate/:id', planeController.activatePlane); // For activating
router.get('/all', planeController.viewAllPlanes); // For viewing all planes
router.get('/:id', planeController.getPlaneDetails); // For fetching details



module.exports = router;
