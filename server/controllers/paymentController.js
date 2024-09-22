// controllers/paymentController.js

const Payment = require('../models/Payment'); // Adjust the path as necessary

// Create a new payment
exports.createPayment = async (req, res) => {
  console.log('createPayment called');
  console.log('Request Body:', req.body);
  
  try {
    const { userId, paymentDate, amount, paymentMethod, paymentStatus } = req.body;

    // Optional: Validate if userId corresponds to an existing user
    // console.log('Validating user ID:', userId);
    // const user = await User.findById(userId);
    // if (!user) {
    //   console.log('Invalid user ID:', userId);
    //   return res.status(400).json({ message: 'Invalid user ID' });
    // }

    const payment = new Payment({
      userId,
      paymentDate,
      amount,
      paymentMethod,
      paymentStatus,
    });

    console.log('Saving payment to database:', payment);

    const savedPayment = await payment.save();

    console.log('Payment saved successfully:', savedPayment);

    res.status(201).json(savedPayment);
  } catch (error) {
    console.error('Error in createPayment:', error.message);
    res.status(400).json({ error: error.message });
  }
};

// Get all payments (optionally filter by userId)
exports.getAllPayments = async (req, res) => {
  console.log('getAllPayments called');
  console.log('Query Parameters:', req.query);
  
  try {
    const { userId } = req.query; // Optional: Filter payments by userId if provided
    let filter = {};
    if (userId) {
      filter.userId = userId;
      console.log('Filtering payments by userId:', userId);
    }

    console.log('Filter criteria:', filter);

    const payments = await Payment.find(filter).populate('userId', 'name email'); // Adjust fields as necessary

    console.log(`Retrieved ${payments.length} payment(s) from the database`);

    res.status(200).json(payments);
  } catch (error) {
    console.error('Error in getAllPayments:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get a single payment by ID
exports.getPaymentById = async (req, res) => {
  console.log('getPaymentById called');
  console.log('Payment ID:', req.params.id);
  
  try {
    const payment = await Payment.findById(req.params.id).populate('userId', 'name email'); // Adjust fields as necessary
    if (!payment) {
      console.log('Payment not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Payment not found' });
    }

    console.log('Payment retrieved:', payment);

    res.status(200).json(payment);
  } catch (error) {
    console.error('Error in getPaymentById:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Update a payment by ID
exports.updatePayment = async (req, res) => {
  console.log('updatePayment called');
  console.log('Payment ID:', req.params.id);
  console.log('Request Body:', req.body);
  
  try {
    const { userId, paymentDate, amount, paymentMethod, paymentStatus } = req.body;

    // Optional: Validate if userId corresponds to an existing user
    // if (userId) {
    //   console.log('Validating user ID:', userId);
    //   const user = await User.findById(userId);
    //   if (!user) {
    //     console.log('Invalid user ID:', userId);
    //     return res.status(400).json({ message: 'Invalid user ID' });
    //   }
    // }

    console.log('Updating payment with new data:', { userId, paymentDate, amount, paymentMethod, paymentStatus });

    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.id,
      { userId, paymentDate, amount, paymentMethod, paymentStatus },
      { new: true, runValidators: true }
    ).populate('userId', 'name email'); // Adjust fields as necessary

    if (!updatedPayment) {
      console.log('Payment not found for update with ID:', req.params.id);
      return res.status(404).json({ message: 'Payment not found' });
    }

    console.log('Payment updated successfully:', updatedPayment);

    res.status(200).json(updatedPayment);
  } catch (error) {
    console.error('Error in updatePayment:', error.message);
    res.status(400).json({ error: error.message });
  }
};

// Delete a payment by ID
exports.deletePayment = async (req, res) => {
  console.log('deletePayment called');
  console.log('Payment ID:', req.params.id);
  
  try {
    const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
    if (!deletedPayment) {
      console.log('Payment not found for deletion with ID:', req.params.id);
      return res.status(404).json({ message: 'Payment not found' });
    }

    console.log('Payment deleted successfully:', deletedPayment);

    res.status(200).json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Error in deletePayment:', error.message);
    res.status(500).json({ error: error.message });
  }
};
