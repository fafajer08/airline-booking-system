const Passenger = require('../models/Passenger'); // Adjust the path according to your project structure

// Controller for Passenger Operations
const passengerController = {
  // Add a new passenger
  async addPassenger(req, res) {
    try {
      const { firstName, lastName, nationality, passportNo, birthday, email, phoneNo } = req.body;

      // Validate required fields
      if (!firstName || !lastName || !nationality || !passportNo || !birthday || !email || !phoneNo) {
        console.log('Missing required fields:', { firstName, lastName, nationality, passportNo, birthday, email, phoneNo }); // Debugging
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const newPassenger = new Passenger({
        firstName,
        lastName,
        nationality,
        passportNo,
        birthday,
        email,
        phoneNo,
      });

      const savedPassenger = await newPassenger.save();
      console.log('New passenger saved:', savedPassenger); // Debugging
      res.status(201).json(savedPassenger);
    } catch (error) {
      console.error('Error adding passenger:', error); // Debugging
      res.status(500).json({ message: 'Error adding passenger', error });
    }
  },

  // Check if a passenger exists before adding a new one
  async checkAddPassenger(req, res) {
    try {
      const { firstName, lastName, birthday, nationality, passportNo, email, phoneNo } = req.body;

      // Validate required fields
      if (!firstName || !lastName || !birthday || !nationality || !passportNo || !email || !phoneNo) {
        console.log('Missing required fields:', { firstName, lastName, birthday, nationality, passportNo, email, phoneNo }); // Debugging
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Check if the passenger already exists based on firstName, lastName, and birthday
      const existingPassenger = await Passenger.findOne({ firstName, lastName, birthday });

      if (existingPassenger) {
        console.log('Passenger already exists:', existingPassenger); // Debugging
        return res.status(200).json({ message: 'Passenger already exists', id: existingPassenger._id });
      }

      // Add a new passenger if not found
      const newPassenger = new Passenger({
        firstName,
        lastName,
        nationality,
        passportNo,
        birthday,
        email,
        phoneNo,
      });

      const savedPassenger = await newPassenger.save();
      console.log('New passenger saved:', savedPassenger); // Debugging
      res.status(201).json({ message: 'Passenger added successfully', id: savedPassenger._id });
    } catch (error) {
      console.error('Error in checkAddPassenger:', error); // Debugging
      res.status(500).json({ message: 'Error in checkAddPassenger', error });
    }
  },

  // Edit an existing passenger by ID
  async editPassenger(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      console.log('Editing passenger with ID:', id, 'Updates:', updates); // Debugging

      const updatedPassenger = await Passenger.findByIdAndUpdate(id, updates, { new: true });
      if (!updatedPassenger) {
        console.log('Passenger not found with ID:', id); // Debugging
        return res.status(404).json({ message: 'Passenger not found' });
      }
      console.log('Passenger updated:', updatedPassenger); // Debugging
      res.status(200).json(updatedPassenger);
    } catch (error) {
      console.error('Error editing passenger:', error); // Debugging
      res.status(500).json({ message: 'Error editing passenger', error });
    }
  },

  // Get passenger details by ID
  async getPassengerDetails(req, res) {
    try {
      const { id } = req.params;
      console.log('Fetching passenger details for ID:', id); // Debugging

      const passenger = await Passenger.findById(id);
      if (!passenger) {
        console.log('Passenger not found with ID:', id); // Debugging
        return res.status(404).json({ message: 'Passenger not found' });
      }
      console.log('Passenger details:', passenger); // Debugging
      res.status(200).json(passenger);
    } catch (error) {
      console.error('Error fetching passenger details:', error); // Debugging
      res.status(500).json({ message: 'Error fetching passenger details', error });
    }
  },

  // View all passengers
  async viewAllPassengers(req, res) {
    try {
      console.log('Fetching all passengers'); // Debugging

      const passengers = await Passenger.find({});
      if (!passengers || passengers.length === 0) {
        console.log('No passengers found'); // Debugging
        return res.status(404).json({ message: 'No passengers found' });
      }
      console.log('All passengers:', passengers); // Debugging
      res.status(200).json(passengers);
    } catch (error) {
      console.error('Error fetching passengers:', error); // Debugging
      res.status(500).json({ message: 'Error fetching passengers', error });
    }
  }
};

module.exports = passengerController;
