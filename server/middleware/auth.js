const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../model/user');

dotenv.config();

const debug = false;


module.exports.authenticate = async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            success: false,
            error: 'Authentication: Access denied. No token provided or invalid format.'
        });
    }

    const token = authHeader.split(' ')[1].trim();

    if (!token) {
        return res.status(401).json({ 
            success: false,
            error: 'Authentication: Access denied. Token missing.'
        });
    } 

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
        if (debug) {
            console.log('Authenticate - Decoded JWT:', decoded);
        }

        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            res.status(404).json({ 
                success: false,
                error: 'Authenticate: user not found'
            })
        }

        req.user = {
            userId: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin
        };

        if (debug) {
            console.log('Authenticate - res.user:', req.user);
        }

        next();

    }
    catch (err) {
        if (debug) {
            console.error('Authentication Middleware Error:', err);
        }
        res.status(400).json({
            success: false,
            message: 'Authentication: Invalid or expired token.'
    })
    
}
}

module.exports.authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        return next();
    } else {
        res.status(403).json({
            success: false,
            error: 'authorizeAdmin: Access denied. User is not an admin'
        })
    }
    
}