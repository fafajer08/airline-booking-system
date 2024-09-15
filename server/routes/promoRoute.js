const express = require('express');
const router = express.Router();
const promoController = require('../controllers/promoController');

// Routes for Promo operations
router.post('/', promoController.addPromo); // Add a new promo
router.put('/:id', promoController.editPromo); // Edit an existing promo
router.patch('/:id/activate', promoController.activatePromo); // Activate a promo
router.patch('/:id/archive', promoController.deactivatePromo); // Deactivate a promo
router.get('/all', promoController.viewAllPromos); // View all promos
router.get('/:id', promoController.getPromoDetails); // Get promo details by ID

module.exports = router;
