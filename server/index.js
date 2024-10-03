const express = require("express");
const app = express();
const path = require('path');
require('dotenv').config();

const mongoose = require("mongoose");
const cors = require("cors");

// Define environment config
const port = process.env.PORT || 3000;
const mongodb = process.env.MONGODB_STRING;
// const secret = process.env.clientSecret;
const frontend = process.env.FRONTEND || 'https://airline-booking-system-5n0j.onrender.com';
console.log("frontend ", frontend);

mongoose.connect(mongodb)
.then(() => {
    console.log('Now connected to MongoDB Atlas')})
.catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});

app.use(express.static(path.join(__dirname, 'public')));

// Setup middleware
const corsOptions = {
    origin: ['http://localhost:3000', frontend], // Adjust according to your frontend's URL
    credentials: true,
    optionsSuccessStatus: 200
};
 

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const passport = require('passport');
//const session = require('express-session');
// require('./passport');
// Setup session and passport
// app.use(session({
//     secret: secret,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         secure: false, // Set to true if you're using HTTPS in production
//         maxAge: 24 * 60 * 60 * 1000 // 24 hours session expiry
//     }
// }));
// app.use(passport.initialize());
// app.use(passport.session());

// Define routes
const userRoutes = require("./routes/userRoute");
const airplaneRoutes = require("./routes/airplaneRoute");
const airportRoutes = require("./routes/airportRoute");
const routeRoutes = require("./routes/routeRoute");
const flightRoutes = require("./routes/flightRoute");
const pricingRoutes = require("./routes/pricingRoute");
const promoRoutes = require("./routes/promoRoute");
const commercialFlightsRoutes = require("./routes/commercialFlightRoute");
const bookingRoutes = require("./routes/bookingRoute");
const passengerRoutes = require("./routes/passengerRoute");
const paymentRoutes = require("./routes/paymentRoute");


// Setup routes
app.use("/users", userRoutes);
app.use("/airplanes", airplaneRoutes); // Added plane routes
app.use("/airports", airportRoutes); 
app.use("/routes", routeRoutes);
app.use("/flights", flightRoutes);
app.use("/pricing", pricingRoutes);
app.use("/promos", promoRoutes)
app.use("/commercialflights", commercialFlightsRoutes);
app.use("/bookings", bookingRoutes);
app.use("/passengers", passengerRoutes);
app.use("/payments", paymentRoutes);



// Initialize the server
if (require.main === module) {
    app.listen(port, () => {
        console.log(`API is now online on port ${port}`);
    });
}

module.exports = { app, mongoose };
