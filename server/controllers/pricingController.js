const Pricing = require('../models/Pricing');

const pricingController = {
  // Add a new pricing
  async addPricing(req, res) {
    try {
      console.log('Received request to add pricing:', req.body); // Debugging

      const { priceName, basePrice, distanceFactor, firstClassFactor, businessFactor, premiumFactor, economyFactor } = req.body;

      // Validate required fields
      if (!priceName || !basePrice) {
        console.log('Missing required fields:', { priceName, basePrice }); // Debugging
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const newPricing = new Pricing({
        priceName,
        basePrice,
        distanceFactor,
        firstClassFactor,
        businessFactor,
        premiumFactor,
        economyFactor
      });

      const savedPricing = await newPricing.save();
      console.log('New pricing saved:', savedPricing); // Debugging

      res.status(201).json(savedPricing);
    } catch (error) {
      console.error('Error adding pricing:', error); // Debugging
      res.status(500).json({ message: 'Error adding pricing', error });
    }
  },

  // Edit an existing pricing by _id
  async editPricing(req, res) {
    try {
      console.log('Received request to edit pricing:', req.params.id, req.body); // Debugging

      const { id } = req.params;
      const updates = req.body;

      const updatedPricing = await Pricing.findByIdAndUpdate(id, updates, { new: true });
      if (!updatedPricing) {
        console.log('Pricing not found:', id); // Debugging
        return res.status(404).json({ message: 'Pricing not found' });
      }

      console.log('Pricing updated:', updatedPricing); // Debugging
      res.status(200).json(updatedPricing);
    } catch (error) {
      console.error('Error editing pricing:', error); // Debugging
      res.status(500).json({ message: 'Error editing pricing', error });
    }
  },

  // Archive a pricing by _id (soft delete, using an `isActive` flag)
  async archivePricing(req, res) {
    try {
      console.log('Received request to archive pricing:', req.params.id); // Debugging

      const { id } = req.params;

      const updatedPricing = await Pricing.findByIdAndUpdate(
        id,
        { isActive: false }, // Set the pricing as inactive
        { new: true }
      );

      if (!updatedPricing) {
        console.log('Pricing not found:', id); // Debugging
        return res.status(404).json({ message: 'Pricing not found' });
      }

      console.log('Pricing archived:', updatedPricing); // Debugging
      res.status(200).json({ message: 'Pricing archived successfully', updatedPricing });
    } catch (error) {
      console.error('Error archiving pricing:', error); // Debugging
      res.status(500).json({ message: 'Error archiving pricing', error });
    }
  },

  // Activate a pricing by _id (set `isActive` flag to true)
  async activatePricing(req, res) {
    try {
      console.log('Received request to activate pricing:', req.params.id); // Debugging

      const { id } = req.params;

      const updatedPricing = await Pricing.findByIdAndUpdate(
        id,
        { isActive: true }, // Set the pricing as active
        { new: true }
      );

      if (!updatedPricing) {
        console.log('Pricing not found:', id); // Debugging
        return res.status(404).json({ message: 'Pricing not found' });
      }

      console.log('Pricing activated:', updatedPricing); // Debugging
      res.status(200).json({ message: 'Pricing activated successfully', updatedPricing });
    } catch (error) {
      console.error('Error activating pricing:', error); // Debugging
      res.status(500).json({ message: 'Error activating pricing', error });
    }
  },

  // Get pricing details by _id
  async getPricingDetails(req, res) {
    try {
      console.log('Received request to get pricing details:', req.params.id); // Debugging

      const { id } = req.params;

      const pricing = await Pricing.findById(id);
      if (!pricing) {
        console.log('Pricing not found:', id); // Debugging
        return res.status(404).json({ message: 'Pricing not found' });
      }

      // console.log('Pricing details:', pricing); // Debugging
      res.status(200).json(pricing);
    } catch (error) {
      console.error('Error fetching pricing details:', error); // Debugging
      res.status(500).json({ message: 'Error fetching pricing details', error });
    }
  },

  // View all pricing
  async viewAllPricing(req, res) {
    try {
      console.log('Received request to view all pricing'); // Debugging

      const pricings = await Pricing.find({});
      if (!pricings || pricings.length === 0) {
        console.log('No pricings found'); // Debugging
        return res.status(404).json({ message: 'No pricings found' });
      }

      console.log('All pricings:', pricings); // Debugging
      res.status(200).json(pricings);
    } catch (error) {
      console.error('Error fetching pricings:', error); // Debugging
      res.status(500).json({ message: 'Error fetching pricings', error });
    }
  }
};

module.exports = pricingController;
