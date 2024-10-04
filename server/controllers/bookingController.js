const Booking = require('../models/Booking');
const Passenger = require('../models/Passenger');
const Payment = require('../models/Payment');
const CommercialFlight = require('../models/CommercialFlight');
const Promo = require('../models/Promo');
const User = require('../models/User');

module.exports = {
  // Add a new booking
  async addBooking(req, res) {
    try {
      const { userId, passengerIds, commercialFlightId, seatClass, promoId, fare, } = req.body;
      
      // Log incoming data
      console.log('Received booking data:', req.body);

      // Check if required fields are present
      if (!passengerIds || !commercialFlightId || !seatClass) {
        console.log('Missing required fields:', { userId, passengerIds, commercialFlightId, seatClass });
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const newBooking = new Booking({
        userId,
        passengerIds,
        commercialFlightId,
        seatClass,
        promoId: promoId || null, // If promoId exists, use it; otherwise, set to null
        // fare: parseFloat(fare),
        fare: typeof fare === 'number' ? fare : parseFloat(fare.replace(/,/g, '')),
        seatClass
      });

      const savedBooking =  await newBooking.save();

      // Populate everything, including all nested fields in commercialFlightId
      const populatedBooking = await Booking.findById(savedBooking._id)
      .populate('userId') // Populate all fields from the User document
      .populate('passengerIds') // Populate all fields from Passenger documents
      .populate({
        path: 'commercialFlightId',  // First, populate the commercialFlightId
        populate: [
          {
            path: 'flight',  // Populate the 'flight' field inside commercialFlightId
            populate: {
              path: 'route',  // Populate the 'route' field inside flight
              populate: [
                { path: 'destination' },  // Populate the 'destination' field inside route
                { path: 'departure' }     // Populate the 'departure' field inside route
              ]
            }
          },
          {
            path: 'pricing',  // Populate the 'pricing' field inside commercialFlightId
          }
        ]
      })

      console.log('New booking saved:', populatedBooking);
      res.status(201).json(populatedBooking);
    } catch (error) {
      console.error('Error adding booking:', error);
      res.status(500).json({ message: 'Error adding booking', error });
    }
  },

  // Get booking details by ID
  async getBookingDetails(req, res) {
    try {
      const bookingId = req.params.id;
      console.log('Fetching booking details for ID:', bookingId);

      const booking = await Booking.findById(bookingId)
        .populate('userId', 'name email')
        .populate('passengerIds', 'firstName lastName email')
        .populate('commercialFlightId', 'flightNo departureTime')
        .populate('promoId', 'promoCode discount');

      if (!booking) {
        console.log('Booking not found for ID:', bookingId);
        return res.status(404).json({ message: 'Booking not found' });
      }

      console.log('Booking details fetched:', booking);
      res.status(200).json(booking);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      res.status(500).json({ message: 'Error fetching booking details', error });
    }
  },

  // Update booking status (confirm, cancel)
  async updateBookingPayment(req, res) {
    try {
      const bookingId = req.params.id;
      const { paymentId } = req.body;
  
      console.log('Attempting to update booking with ID:', bookingId);
  
      // Step 1: Find the booking by ID
      const booking = await Booking.findById(bookingId);
  
      if (!booking) {
        console.log('Booking not found for ID:', bookingId);
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      // Step 2: Check if paymentId is already set (i.e., not null)
      if (booking.paymentId) {
        console.log('Booking already paid with payment ID:', booking.paymentId);
        return res.status(400).json({ message: 'Booking is already paid', paymentId: booking.paymentId });
      }
  
      // Step 3: Update booking with new paymentId and set status to 'confirmed'
      booking.paymentId = paymentId;
      booking.bookingStatus = 'confirmed';
  
      const updatedBooking = await booking.save();
  
      console.log('Booking updated with payment ID:', paymentId);
      res.status(200).json(updatedBooking);
  
    } catch (error) {
      console.error('Error updating booking payment:', error);
      res.status(500).json({ message: 'Error updating booking payment', error });
    }
  },
  

  // View all bookings
  async viewAllBookings(req, res) {
    try {
      console.log('Fetching all bookings');

      const bookings = await Booking.find()
        .populate('userId', 'name email')
        .populate('passengerIds', 'firstName lastName email')
        .populate('commercialFlightId', 'flightNo departureTime')
        .populate('promoId', 'promoCode discount');

      console.log('All bookings fetched:', bookings);
      res.status(200).json(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ message: 'Error fetching bookings', error });
    }
  },

  async viewMyBookings(req, res) {
    try {
      console.log('Fetching my bookings');
      
      const userId = req.user.id;
      console.log('Fetching by userId:', userId);
      
      // Fetch bookings based on userId, then populate referenced fields
      const bookings = await Booking.find({ userId: userId })
        .populate('passengerIds')
        .populate('promoId')
        .populate({
          path: 'commercialFlightId',
          populate: [
            {
              path: 'flight',
              populate: [
                {
                  path: 'route',
                  populate: [
                    { path: 'destination' }, // Correctly nested population for 'destination'
                    { path: 'departure' }     // Correctly nested population for 'departure'
                  ]
                }
              ]
            },
            {
              path: 'pricing' // Separate path for 'pricing' population
            }
          ]
        });
  
      console.log('All my bookings fetched:', bookings);
      res.status(200).json(bookings);
  
    } catch (error) {
      console.error('Error fetching my bookings:', error);
      res.status(500).json({ message: 'Error fetching my bookings', error });
    }
  }
  
  
};
