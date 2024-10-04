const CommercialFlight = require('../models/CommercialFlight');
const Booking = require('../models/Booking');
const Pricing = require('../models/Pricing');
const Flight = require('../models/Flight');
const Airplane = require('../models/Airplane'); 
const Payment = require('../models/Payment'); 
const Joi = require('joi');


const commercialFlightController = {
  // Add a new commercial flight with unique check
  async addCommercialFlight(req, res) {
    try {
      console.log('Received request to add commercial flight:', req.body); // Debugging

      const { flight, pricing, date, departureTime, bookings } = req.body;

      if (!flight || !pricing || !date || !departureTime) {
        console.log('Missing required fields:', { flight, pricing, date, departureTime }); // Debugging
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Check if a commercial flight with the same flight, date, and departureTime already exists
      const existingFlight = await CommercialFlight.findOne({ flight, date, departureTime });
      if (existingFlight) {
        console.log('Commercial flight already exists:', existingFlight); // Debugging
        return res.status(400).json({ message: 'Commercial flight already exists', id: existingFlight._id });
      }

      // Fetch the Flight object
      const flightData = await Flight.findById(flight).populate('airplane');
      if (!flightData) {
        return res.status(404).json({ message: 'Flight not found' });
      }

      // Fetch the Airplane object
      const airplaneData = await Airplane.findById(flightData.airplane);
      if (!airplaneData) {
        return res.status(404).json({ message: 'Airplane not found' });
      }

      // Set availableSeats from airplane seat data
      const availableSeats = {
        totalSeats: airplaneData.totalSeats,
        economySeat: airplaneData.economySeat,
        premiumSeat: airplaneData.premiumSeat,
        businessSeat: airplaneData.businessSeat,
        firstClass: airplaneData.firstClass,
      };

      // Create a new commercial flight
      const newCommercialFlight = new CommercialFlight({
        flight,
        pricing,
        date,
        departureTime,
        bookings: bookings || [], // Initialize with an empty array if bookings are not provided
        availableSeats, // Set availableSeats to the seat data from the airplane
      });

      const savedCommercialFlight = await newCommercialFlight.save();
      console.log('New commercial flight saved:', savedCommercialFlight); // Debugging

      res.status(201).json(savedCommercialFlight);
    } catch (error) {
      console.error('Error adding commercial flight:', error); // Debugging
      if (error.code === 11000) { // Handle duplicate key error for unique index
        res.status(400).json({ message: 'Commercial flight with the same flight, date, and departure time already exists' });
      } else {
        res.status(500).json({ message: 'Error adding commercial flight', error });
      }
    }
  },



    // Add multiple commercial flights
    async addMultipleCommercialFlights(req, res) {
      try {
        console.log('Received request to add multiple commercial flights:', JSON.stringify(req.body, null, 2)); // Detailed Debugging
  
        const flightsToAdd = req.body.flights; // Assuming the array is sent as `flights`
        if (!Array.isArray(flightsToAdd) || flightsToAdd.length === 0) {
          console.log('No flights provided in the request body.'); // Debugging
          return res.status(400).json({ message: 'No flights provided' });
        }
  
        const newFlights = [];
        const alreadyExist = [];
        const errors = [];
  
        // Iterate over each flight to check if it already exists
        for (const flightData of flightsToAdd) {
          const { flightId, priceId, date, departureTime } = flightData;
          console.log(`Processing flight data: ${JSON.stringify(flightData)}`); // Debugging
  
          // Ensure all required fields are present
          if (!flightId || !priceId || !date || !departureTime) {
            console.log(`Missing required fields in flight data: ${JSON.stringify(flightData)}`); // Debugging
            errors.push({ flightId, message: 'Missing required fields' });
            continue; // Skip to the next flight
          }
  
          // Ensure date and departureTime are in correct formats
          if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            console.log(`Invalid date format for flight ID ${flightId}: ${date}`); // Debugging
            errors.push({ flightId, message: `Invalid date format: ${date}` });
            continue; // Skip to the next flight
          }
          if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(departureTime)) {
            console.log(`Invalid departureTime format for flight ID ${flightId}: ${departureTime}`); // Debugging
            errors.push({ flightId, message: `Invalid departureTime format: ${departureTime}` });
            continue; // Skip to the next flight
          }
  
          // Check if a commercial flight with the same flight, date, and departureTime already exists
          const existingFlight = await CommercialFlight.findOne({
            flight: flightId,
            date: date, // Compare date as string
            departureTime: departureTime, // Direct string comparison
          });
  
          if (existingFlight) {
            console.log(`Flight already exists: ${JSON.stringify(existingFlight)}`); // Debugging
            // If the flight already exists, add it to the alreadyExist array
            alreadyExist.push({ id: existingFlight._id, flight: flightId, date, departureTime });
          } else {
            try {
              // Fetch the Flight object
              const flightDoc = await Flight.findById(flightId).populate('airplane');
              if (!flightDoc) {
                console.log(`Flight document not found for ID ${flightId}`); // Debugging
                errors.push({ flightId, message: `Flight not found for ID ${flightId}` });
                continue; // Skip to the next flight
              }
  
              // Fetch the Airplane object
              const airplaneData = await Airplane.findById(flightDoc.airplane);
              if (!airplaneData) {
                console.log(`Airplane document not found for flight ID ${flightId}`); // Debugging
                errors.push({ flightId, message: `Airplane not found for flight ID ${flightId}` });
                continue; // Skip to the next flight
              }
  
              // Set availableSeats from airplane seat data
              const availableSeats = {
                totalSeats: airplaneData.totalSeats,
                economySeat: airplaneData.economySeat,
                premiumSeat: airplaneData.premiumSeat,
                businessSeat: airplaneData.businessSeat,
                firstClass: airplaneData.firstClass,
              };
  
              // Prepare the flight data to be added
              const newFlightData = {
                flight: flightId,
                pricing: priceId,
                date: date, // Store date as a string
                departureTime, // Store the time as a string
                availableSeats,
              };
  
              console.log(`Prepared new flight data for insertion: ${JSON.stringify(newFlightData)}`); // Debugging
  
              newFlights.push(newFlightData);
            } catch (err) {
              console.log(`Error processing flight ID ${flightId}: ${err.message}`); // Debugging
              errors.push({ flightId, message: err.message });
              continue; // Skip to the next flight
            }
          }
        }
  
        console.log(`Total new flights to insert: ${newFlights.length}`); // Debugging
        console.log(`Flights that already exist: ${alreadyExist.length}`); // Debugging
        console.log(`Errors encountered: ${errors.length}`); // Debugging
  
        // Add new flights to the database
        let savedCommercialFlights = [];
        if (newFlights.length > 0) {
          try {
            savedCommercialFlights = await CommercialFlight.insertMany(newFlights);
            console.log('New commercial flights saved:', JSON.stringify(savedCommercialFlights, null, 2)); // Debugging
          } catch (insertError) {
            console.error('Error inserting new flights:', insertError); // Debugging
            errors.push({ message: 'Error inserting new flights', details: insertError.message });
          }
        } else {
          console.log('No new commercial flights to add after processing.'); // Debugging
        }
  
        // Return the added flights, already existing flights, and any errors in the response
        res.status(201).json({
          added: savedCommercialFlights,
          alreadyExist: alreadyExist,
          errors: errors,
        });
      } catch (error) {
        console.error('Error adding multiple commercial flights:', error); // Debugging
        res.status(500).json({ message: 'Error adding multiple commercial flights', error });
      }
    },
  
  

  async editCommercialFlight(req, res) {
    try {
      console.log('Received request to edit commercial flight:', req.params.id, req.body); // Debugging
      const { id } = req.params;
      const updates = req.body;

      const updatedCommercialFlight = await CommercialFlight.findByIdAndUpdate(id, updates, { new: true });
      if (!updatedCommercialFlight) {
        console.log('Commercial flight not found:', id); // Debugging
        return res.status(404).json({ message: 'Commercial flight not found' });
      }

      console.log('Commercial flight updated:', updatedCommercialFlight); // Debugging
      res.status(200).json(updatedCommercialFlight);
    } catch (error) {
      console.error('Error editing commercial flight:', error); // Debugging
      res.status(500).json({ message: 'Error editing commercial flight', error });
    }
  },

  // Archive (deactivate) a commercial flight
  async archiveCommercialFlight(req, res) {
    try {
      console.log('Received request to archive commercial flight:', req.params.id); // Debugging
      const { id } = req.params;

      const updatedCommercialFlight = await CommercialFlight.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!updatedCommercialFlight) {
        console.log('Commercial flight not found:', id); // Debugging
        return res.status(404).json({ message: 'Commercial flight not found' });
      }

      console.log('Commercial flight archived:', updatedCommercialFlight); // Debugging
      res.status(200).json({ message: 'Commercial flight archived successfully', updatedCommercialFlight });
    } catch (error) {
      console.error('Error archiving commercial flight:', error); // Debugging
      res.status(500).json({ message: 'Error archiving commercial flight', error });
    }
  },

  // Activate a commercial flight
  async activateCommercialFlight(req, res) {
    try {
      console.log('Received request to activate commercial flight:', req.params.id); // Debugging
      const { id } = req.params;

      const updatedCommercialFlight = await CommercialFlight.findByIdAndUpdate(
        id,
        { isActive: true },
        { new: true }
      );

      if (!updatedCommercialFlight) {
        console.log('Commercial flight not found:', id); // Debugging
        return res.status(404).json({ message: 'Commercial flight not found' });
      }

      console.log('Commercial flight activated:', updatedCommercialFlight); // Debugging
      res.status(200).json({ message: 'Commercial flight activated successfully', updatedCommercialFlight });
    } catch (error) {
      console.error('Error activating commercial flight:', error); // Debugging
      res.status(500).json({ message: 'Error activating commercial flight', error });
    }
  },

  // Cancel a commercial flight
  async cancelCommercialFlight(req, res) {
    try {
      console.log('Received request to cancel commercial flight:', req.params.id); // Debugging
      const { id } = req.params;

      const updatedCommercialFlight = await CommercialFlight.findByIdAndUpdate(
        id,
        { isCancelled: true },
        { new: true }
      );

      if (!updatedCommercialFlight) {
        console.log('Commercial flight not found:', id); // Debugging
        return res.status(404).json({ message: 'Commercial flight not found' });
      }

      console.log('Commercial flight cancelled:', updatedCommercialFlight); // Debugging
      res.status(200).json({ message: 'Commercial flight cancelled successfully', updatedCommercialFlight });
    } catch (error) {
      console.error('Error cancelling commercial flight:', error); // Debugging
      res.status(500).json({ message: 'Error cancelling commercial flight', error });
    }
  },

  // Mark a commercial flight as done
  async markCommercialFlightDone(req, res) {
    try {
      console.log('Received request to mark commercial flight as done:', req.params.id); // Debugging
      const { id } = req.params;

      const updatedCommercialFlight = await CommercialFlight.findByIdAndUpdate(
        id,
        { isDone: true },
        { new: true }
      );

      if (!updatedCommercialFlight) {
        console.log('Commercial flight not found:', id); // Debugging
        return res.status(404).json({ message: 'Commercial flight not found' });
      }

      console.log('Commercial flight marked as done:', updatedCommercialFlight); // Debugging
      res.status(200).json({ message: 'Commercial flight marked as done successfully', updatedCommercialFlight });
    } catch (error) {
      console.error('Error marking commercial flight as done:', error); // Debugging
      res.status(500).json({ message: 'Error marking commercial flight as done', error });
    }
  },

  // Get details of a specific commercial flight
  async getCommercialFlightDetails(req, res) {
    try {
      console.log('Received request to get commercial flight details:', req.params.id); // Debugging
      const { id } = req.params;

      const commercialFlight = await CommercialFlight.findById(id).populate('flight pricing bookings');

      if (!commercialFlight) {
        console.log('Commercial flight not found:', id); // Debugging
        return res.status(404).json({ message: 'Commercial flight not found' });
      }

      console.log('Commercial flight details:', commercialFlight); // Debugging
      res.status(200).json(commercialFlight);
    } catch (error) {
      console.error('Error fetching commercial flight details:', error); // Debugging
      res.status(500).json({ message: 'Error fetching commercial flight details', error });
    }
  },

  // View all commercial flights
  async viewAllCommercialFlights(req, res) {
    try {
      console.log('Received request to view all commercial flights'); // Debugging
  
      const commercialFlights = await CommercialFlight.find({})
        .populate({
          path: 'flight',
          populate: [
            {
              path: 'airplane',
            },
            {
              path: 'route',
              populate: [
                { path: 'departure', model: 'Airport' },
                { path: 'destination', model: 'Airport' },
              ],
            },
          ],
        })
        .populate('pricing')
        .populate('bookings');
  
      if (!commercialFlights || commercialFlights.length === 0) {
        console.log('No commercial flights found'); // Debugging
        return res.status(404).json({ message: 'No commercial flights found' });
      }
  
      res.status(200).json(commercialFlights);
    } catch (error) {
      console.error('Error fetching commercial flights:', error); // Debugging
      res.status(500).json({ message: 'Error fetching commercial flights', error });
    }
  },
  
  // async addBooking(req, res) {
  //   try {
  //     const flightId = req.params.id; // flight ID from URL params
  //     const bookingId = req.body.bookingId; // booking ID from request body
  //     const noPassenger = req.body.noPassenger; // number of passengers
  //     const seatClass = req.body.seatClass; // seat class (economy, premium, etc.)
  
  //     // Find the commercial flight by ID
  //     const flight = await CommercialFlight.findById(flightId);
  
  //     if (!flight) {
  //       return res.status(404).json({ message: "Flight not found" });
  //     }
  
  //     // Check if there are enough available seats for the given class
  //     let availableSeats;
  //     switch (seatClass.toLowerCase()) {
  //       case 'economy':
  //         availableSeats = flight.availableSeats.economySeat;
  //         if (availableSeats < noPassenger) {
  //           return res.status(400).json({ message: "Not enough economy seats available" });
  //         }
  //         flight.availableSeats.economySeat -= noPassenger;
  //         break;
  //       case 'premium':
  //         availableSeats = flight.availableSeats.premiumSeat;
  //         if (availableSeats < noPassenger) {
  //           return res.status(400).json({ message: "Not enough premium seats available" });
  //         }
  //         flight.availableSeats.premiumSeat -= noPassenger;
  //         break;
  //       case 'business':
  //         availableSeats = flight.availableSeats.businessSeat;
  //         if (availableSeats < noPassenger) {
  //           return res.status(400).json({ message: "Not enough business seats available" });
  //         }
  //         flight.availableSeats.businessSeat -= noPassenger;
  //         break;
  //       case 'first':
  //         availableSeats = flight.availableSeats.firstClass;
  //         if (availableSeats < noPassenger) {
  //           return res.status(400).json({ message: "Not enough first-class seats available" });
  //         }
  //         flight.availableSeats.firstClass -= noPassenger;
  //         break;
  //       default:
  //         return res.status(400).json({ message: "Invalid seat class" });
  //     }
  
  //     // Add the bookingId to the bookings array
  //     flight.bookings.push(bookingId);
  
  //     // Save the updated flight
  //     await flight.save();
  
  //     return res.status(200).json({ message: "Booking added successfully", flight });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({ message: "Internal server error" });
  //   }
  // },
  
  async addBooking(req, res) {
    try {
      console.log('Received request to add booking:', req.params, req.body); // Debugging: Log request params and body
      
      const { id: flightId } = req.params;
      const { bookingId, noPassenger, seatClass, paymentMethod } = req.body;
      
      // Step 1: Simulate successful payment
      console.log(`Simulating payment for booking ID ${bookingId} with amount: ${req.body.amount}`); // Debugging: Log payment details
      const payment = new Payment({
        bookingId,
        paymentDate: new Date(),
        amount: parseFloat(req.body.amount), // Use total cost
        paymentMethod,
        isPaid: true,
        paymentStatus: 'paid'
      });
      await payment.save();
      console.log('Payment saved:', payment); // Debugging: Log saved payment
  
      // Step 2: Update the booking with payment ID and confirm booking status
      console.log(`Updating booking ${bookingId} with payment ID ${payment._id}`); // Debugging: Log booking update attempt
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        {
          paymentId: payment._id,
          bookingStatus: 'confirmed'
        },
        { new: true }
      );
  
      if (!booking) {
        console.log(`Booking not found for ID ${bookingId}`); // Debugging: Log if booking is not found
        return res.status(404).json({ message: 'Booking not found' });
      }
      console.log('Booking updated successfully:', booking); // Debugging: Log updated booking
  
      // Step 3: Find the commercial flight and update available seats
      console.log(`Fetching flight details for flight ID ${flightId}`); // Debugging: Log flight retrieval
      const flight = await CommercialFlight.findById(flightId);
      if (!flight) {
        console.log(`Flight not found for ID ${flightId}`); // Debugging: Log if flight is not found
        return res.status(404).json({ message: 'Flight not found' });
      }
      console.log('Flight found:', flight); // Debugging: Log found flight details
  
      // Step 3.1: Update available seats based on seat class
      console.log(`Updating available seats for seat class: ${seatClass} with ${noPassenger} passengers`); // Debugging: Log seat update
      switch (seatClass.toLowerCase()) {
        case 'economySeat':
          if (flight.availableSeats.economySeat < noPassenger) {
            console.log(`Not enough economy seats: Available - ${flight.availableSeats.economySeat}, Requested - ${noPassenger}`); // Debugging: Log seat error
            return res.status(400).json({ message: 'Not enough economy seats' });
          }
          flight.availableSeats.economySeat -= noPassenger;
          break;
        case 'premiumSeat':
          if (flight.availableSeats.premiumSeat < noPassenger) {
            console.log(`Not enough premium seats: Available - ${flight.availableSeats.premiumSeat}, Requested - ${noPassenger}`); // Debugging: Log seat error
            return res.status(400).json({ message: 'Not enough premium seats' });
          }
          flight.availableSeats.premiumSeat -= noPassenger;
          break;
        case 'businessSeat':
          if (flight.availableSeats.businessSeat < noPassenger) {
            console.log(`Not enough business seats: Available - ${flight.availableSeats.businessSeat}, Requested - ${noPassenger}`); // Debugging: Log seat error
            return res.status(400).json({ message: 'Not enough business seats' });
          }
          flight.availableSeats.businessSeat -= noPassenger;
          break;
        case 'firstClass':
          if (flight.availableSeats.firstClass < noPassenger) {
            console.log(`Not enough first class seats: Available - ${flight.availableSeats.firstClass}, Requested - ${noPassenger}`); // Debugging: Log seat error
            return res.status(400).json({ message: 'Not enough first class seats' });
          }
          flight.availableSeats.firstClass -= noPassenger;
          break;
        default:
          console.log(`Invalid seat class provided: ${seatClass}`); // Debugging: Log invalid seat class
          return res.status(400).json({ message: 'Invalid seat class' });
      }
  
      // Step 4: Update flight bookings array and save flight
      console.log(`Adding booking ID ${bookingId} to flight's bookings array`); // Debugging: Log adding booking to flight
      flight.bookings.push(bookingId);
      await flight.save();
      console.log('Flight updated successfully with new booking:', flight); // Debugging: Log flight update
  
      return res.status(200).json({ message: 'Booking and payment processed successfully', flight });
    } catch (error) {
      console.error('Error processing booking:', error); // Debugging: Log any errors
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
   
  
  





async filterByDepartureAndDestinationAirport(req, res) {
  try {
    console.log('Received request to view all commercial flights'); // Debugging

    const commercialFlights = await CommercialFlight.find({})
      .populate({
        path: 'flight',
        populate: [
          {
            path: 'airplane',
          },
          {
            path: 'route',
            populate: [
              { path: 'departure', model: 'Airport' },
              { path: 'destination', model: 'Airport' },
            ],
          },
        ],
      })
      .populate('pricing')
      .populate('bookings');

    if (!commercialFlights || commercialFlights.length === 0) {
      console.log('No commercial flights found'); // Debugging
      return res.status(404).json({ message: 'No commercial flights found' });
    }

    // Extract filtering parameters
    const { departureCode, destinationCode, departureDate } = req.body; // Assume these are passed in the body

    // Parse the departureDate and calculate the date range
    const targetDate = new Date(departureDate);
    const thirtyDaysAfter = new Date(targetDate);
    thirtyDaysAfter.setDate(targetDate.getDate() + 30);

    const thirtyDaysBefore = new Date(targetDate);
    thirtyDaysBefore.setDate(targetDate.getDate() - 30);

    const currentDate = new Date(); // Get the current date

    // Apply filtering
    const filteredFlights = commercialFlights.filter(flight => {
      const departureCodeMatches = !departureCode || flight.flight.route.departure.airportCode === departureCode;
      const destinationCodeMatches = !destinationCode || flight.flight.route.destination.airportCode === destinationCode;

      // Filter by date
      const flightDate = new Date(flight.date);
      const dateMatches =
        flightDate >= thirtyDaysBefore &&
        flightDate <= thirtyDaysAfter &&
        flightDate >= currentDate; // Ensure it does not exceed the current date

      return departureCodeMatches && destinationCodeMatches && dateMatches;
    });

    if (filteredFlights.length === 0) {
      console.log('No flights match the filter criteria'); // Debugging
      return res.status(404).json({ message: 'No flights match the filter criteria' });
    }

    res.status(200).json(filteredFlights);
  } catch (error) {
    console.error('Error fetching commercial flights:', error); // Debugging
    res.status(500).json({ message: 'Error fetching commercial flights', error });
  }
}


}
module.exports = commercialFlightController;
