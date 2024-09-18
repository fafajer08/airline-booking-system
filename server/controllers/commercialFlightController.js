const CommercialFlight = require('../models/CommercialFlight');
const Booking = require('../models/Booking');
const Pricing = require('../models/Pricing');
const Flight = require('../models/Flight');
const Airplane = require('../models/Airplane'); 
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
  



  // async filterByDepartureAndDestinationAirport(req, res) {
  //   try {
  //     console.log('Received request to view all commercial flights with filters:', req.body); // Debugging
  
  //     const { departureCode, destinationCode, departureDate } = req.body;
  
  //     // Validate required parameters
  //     if (!departureCode || !destinationCode) {
  //       return res.status(400).json({ message: 'Both departureCode and destinationCode are required' });
  //     }
  
  //     if (!departureDate) {
  //       return res.status(400).json({ message: 'departureDate is required' });
  //     }
  
  //     // Parse the departureDate and get the current date
  //     const selectedDepartureDate = new Date(departureDate);
  //     const today = new Date();
  
  //     // Create date range: 30 days before and 30 days after
  //     const startDate = new Date(selectedDepartureDate);
  //     startDate.setDate(startDate.getDate() - 30);
  //     if (startDate < today) {
  //       startDate.setTime(today.getTime());
  //     }
  
  //     const endDate = new Date(selectedDepartureDate);
  //     endDate.setDate(endDate.getDate() + 30);
  
  //     // Find commercial flights with filters applied at the database level for performance
  //     const filteredFlights = await CommercialFlight.find({
  //       'flight.route.departure.airportCode': departureCode,
  //       'flight.route.destination.airportCode': destinationCode
  //       // date: { $gte: startDate, $lte: endDate },
  //     })
  //       .populate({
  //         path: 'flight',
  //         populate: [
  //           { path: 'airplane' },
  //           {
  //             path: 'route',
  //             populate: [
  //               { path: 'departure', model: 'Airport' },
  //               { path: 'destination', model: 'Airport' },
  //             ],
  //           },
  //         ],
  //       })
  //       .populate('pricing')
  //       .populate('bookings');
  
  //     if (!filteredFlights || filteredFlights.length === 0) {
  //       console.log('No commercial flights match the filter criteria'); // Debugging
  //       return res.status(200).json({ message: 'No commercial flights match the filter criteria' });
  //     }
  
  //     res.status(200).json(filteredFlights);
  //   } catch (error) {
  //     console.error('Error fetching commercial flights:', error); // Debugging
  //     res.status(500).json({ message: 'Error fetching commercial flights', error });
  //   }
  // }
  
   // Import necessary modules and models

// Import necessary models


// Updated Controller Function

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
