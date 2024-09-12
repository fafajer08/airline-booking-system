const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require('passport');
const session = require('express-session');
require('./passport');
require('dotenv').config();

// Define environment config
const port = process.env.PORT || 3000;
const mongodb = process.env.MONGODB_STRING;
const secret = process.env.clientSecret;

// Setup middleware
const corsOptions = {
    origin: ['http://localhost:3000'], // Adjust according to your frontend's URL
    credentials: true,
    optionsSuccessStatus: 200
};

// Connect to MongoDB
mongoose.connect(mongodb, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Now connected to MongoDB Atlas');
}).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});

// Setup the server
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// Setup session and passport
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if you're using HTTPS in production
        maxAge: 24 * 60 * 60 * 1000 // 24 hours session expiry
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// Define routes
const userRoutes = require("./routes/userRoute");
const planeRoutes = require("./routes/planeRoute");
const airportRoutes = require("./routes/airportRoute");
const routeRoutes = require("./routes/routeRoute");

// Setup routes
app.use("/users", userRoutes);
app.use("/planes", planeRoutes); // Added plane routes
app.use("/airports", airportRoutes); 
app.use("/routes", routeRoutes);

// Initialize the server
if (require.main === module) {
    app.listen(port, () => {
        console.log(`API is now online on port ${port}`);
    });
}

module.exports = { app, mongoose };
