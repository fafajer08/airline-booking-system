const jwt = require("jsonwebtoken");
require('dotenv').config();

// Token Creation
module.exports.createAccessToken = (user) => {
	const data = {
		id : user._id,
		email: user.email,
		isAdmin : user.isAdmin
	};

	console.log("Creating access token with data:", data);

	return jwt.sign(data, process.env.JWT_SECRET_KEY, {});
};

// Token Verification
module.exports.verify = (req, res, next) => {
	console.log("Verifying token from headers:", req.headers.authorization);

	let token = req.headers.authorization;

	if (typeof token === "undefined") {
		console.log("No token found.");
		return res.send({ auth: "Failed. No Token" });
	} else {
		// Trim token prefix "Bearer"
		token = token.slice(7, token.length);
		console.log("Extracted token:", token);

		jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, decodedToken) {
			if (err) {
				console.log("Token verification failed with error:", err.message);
				return res.status(403).send({
					auth: "Failed",
					message: err.message
				});
			} else {
				console.log("Token successfully verified. Decoded token data:", decodedToken);

				req.user = decodedToken;
				next();
			}
		});
	}
};

// Verify Admin
module.exports.verifyAdmin = (req, res, next) => {
	console.log("Verifying if user is admin. User data:", req.user);

	if (req.user.isAdmin) {
		console.log("User is admin, proceeding.");
		next();
	} else {
		console.log("User is not admin, access denied.");
		return res.status(403).send({
			auth: "Failed",
			message: "Action Forbidden"
		});
	}
};

// Error Handler
module.exports.errorHandler = (err, req, res, next) => {
	// Log the error
	console.error("Error encountered:", err);

	const statusCode = err.status || 500;
	const errorMessage = err.message || 'Internal Server Error';

	console.log("Sending error response with status:", statusCode, "and message:", errorMessage);

	res.status(statusCode).json({
		error: {
			message: errorMessage,
			errorCode: err.code || 'SERVER_ERROR',
			details: err.details || null
		}
	});
};

// Check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
	if (req.user) {
		console.log("User is logged in. Proceeding.");
		next();
	} else {
		console.log("User is not logged in. Sending 401 status.");
		res.sendStatus(401);
	}
};
