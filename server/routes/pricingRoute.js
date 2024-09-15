const express = require('express');
const router = express.Router();
const pricingController = require('../controllers/pricingController');

// Route to add a new pricing
router.post('/', pricingController.addPricing);

// Route to edit an existing pricing
router.put('/:id', pricingController.editPricing);

// Route to archive pricing
router.patch('/:id/archive/', pricingController.archivePricing);

// Route to activate pricing
router.patch('/:id/activate/', pricingController.activatePricing);

// Route to view all pricing
router.get('/all', pricingController.viewAllPricing);

// Route to get pricing details by ID
router.get('/:id', pricingController.getPricingDetails);

module.exports = router;
