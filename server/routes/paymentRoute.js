// routes/paymentRoutes.js

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController'); // Adjust the path accordingly


// Get all payments (supports filtering by userId via query parameter)
router.get('/mypayment', paymentController.getAllPayments);


// Create a new payment
router.post('/', paymentController.createPayment);


// Get a single payment by ID
router.get('/:id', paymentController.getPaymentById);

// Update a payment by ID
router.put('/:id', paymentController.updatePayment);

// Delete a payment by ID
router.delete('/:id', paymentController.deletePayment);

module.exports = router;
