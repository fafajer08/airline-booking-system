const Promo = require('../models/Promo'); // Adjust the path according to your project structure

// Controller for Promo Operations
const promoController = {
  // Add a new promo
  async addPromo(req, res) {
    try {
      const { promoName, promoCode, discount, absolutePricing, promoStart, promoEnd, numberOfSlots, isActive } = req.body;

      console.log('Received data for addPromo:', req.body); // Debugging

      if (!promoName || !promoCode || !promoStart || !promoEnd) {
        console.log('Missing required fields:', { promoName, promoCode, promoStart, promoEnd }); // Debugging
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const newPromo = new Promo({
        promoName,
        promoCode,
        discount,
        absolutePricing,
        promoStart,
        promoEnd,
        numberOfSlots,
        isActive
      });

      const savedPromo = await newPromo.save();
      res.status(201).json(savedPromo);
    } catch (error) {
      console.error('Error adding promo:', error); // Debugging
      res.status(500).json({ message: 'Error adding promo', error });
    }
  },

  // Search promo by promoCode
  async searchPromoByCode(req, res) {
    try {
      const { promoCode } = req.body;
      console.log('Searching for promo with code:', promoCode); // Debugging

      if (!promoCode) {
        return res.status(400).json({ message: 'promoCode is required' });
      }

      const promo = await Promo.findOne({ promoCode });
      if (!promo) {
        console.log('Promo not found with code:', promoCode); // Debugging
        return res.status(404).json({ message: 'Promo not found' });
      }

      console.log('Promo found:', promo); // Debugging
      res.status(200).json(promo);
    } catch (error) {
      console.error('Error searching promo by code:', error); // Debugging
      res.status(500).json({ message: 'Error searching promo by code', error });
    }
  },

  // Edit an existing promo by ID
  async editPromo(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      console.log('Editing promo with ID:', id, 'Updates:', updates);

      const updatedPromo = await Promo.findByIdAndUpdate(id, updates, { new: true });
      if (!updatedPromo) {
        console.log('Promo not found with ID:', id); // Debugging
        return res.status(404).json({ message: 'Promo not found' });
      }
      console.log('Promo updated:', updatedPromo); // Debugging
      res.status(200).json(updatedPromo);
    } catch (error) {
      console.error('Error editing promo:', error); // Debugging
      res.status(500).json({ message: 'Error editing promo', error });
    }
  },

  // Activate a promo by ID
  async activatePromo(req, res) {
    try {
      const { id } = req.params;
      console.log('Activating promo with ID:', id); // Debugging

      const updatedPromo = await Promo.findByIdAndUpdate(id, { isActive: true }, { new: true });

      if (!updatedPromo) {
        console.log('Promo not found with ID:', id); // Debugging
        return res.status(404).json({ message: 'Promo not found' });
      }
      console.log('Promo activated:', updatedPromo); // Debugging
      res.status(200).json({ message: 'Promo activated successfully', updatedPromo });
    } catch (error) {
      console.error('Error activating promo:', error); // Debugging
      res.status(500).json({ message: 'Error activating promo', error });
    }
  },

  // Deactivate a promo by ID
  async deactivatePromo(req, res) {
    try {
      const { id } = req.params;
      console.log('Deactivating promo with ID:', id); // Debugging

      const updatedPromo = await Promo.findByIdAndUpdate(id, { isActive: false }, { new: true });

      if (!updatedPromo) {
        console.log('Promo not found with ID:', id); // Debugging
        return res.status(404).json({ message: 'Promo not found' });
      }
      console.log('Promo deactivated:', updatedPromo); // Debugging
      res.status(200).json({ message: 'Promo deactivated successfully', updatedPromo });
    } catch (error) {
      console.error('Error deactivating promo:', error); // Debugging
      res.status(500).json({ message: 'Error deactivating promo', error });
    }
  },

  // Get promo details by ID
  async getPromoDetails(req, res) {
    try {
      const { id } = req.params;
      console.log('Fetching promo details for ID:', id); // Debugging

      const promo = await Promo.findById(id);
      if (!promo) {
        console.log('Promo not found with ID:', id); // Debugging
        return res.status(404).json({ message: 'Promo not found' });
      }
      console.log('Promo details:', promo); // Debugging
      res.status(200).json(promo);
    } catch (error) {
      console.error('Error fetching promo details:', error); // Debugging
      res.status(500).json({ message: 'Error fetching promo details', error });
    }
  },

  // View all promos
  async viewAllPromos(req, res) {
    try {
      console.log('Fetching all promos'); // Debugging

      const promos = await Promo.find({});
      if (!promos || promos.length === 0) {
        console.log('No promos found'); // Debugging
        return res.status(404).json({ message: 'No promos found' });
      }
      console.log('All promos:', promos); // Debugging
      res.status(200).json(promos);
    } catch (error) {
      console.error('Error fetching promos:', error); // Debugging
      res.status(500).json({ message: 'Error fetching promos', error });
    }
  }
};

module.exports = promoController;
