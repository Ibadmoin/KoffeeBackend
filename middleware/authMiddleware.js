// Corrected authMiddleware.js

const jwtConfig = require('../utils/jwt'); // Note: Imported as jwtConfig here, 
const User = require('../model/userModel'); // but we'll use 'jwtConfig' below.

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Access denied. No token provided or invalid format.' });
        }

        const token = authHeader.split(' ')[1];

        // ✅ CRITICAL FIX: Use the exported function that handles verification!
        // This function verifies the token and returns the decoded payload (the email string).
        const decodedEmail = jwtConfig.verifyEmailToken(token); 
        
        if (!decodedEmail) {
            // This catches expired/invalid tokens handled by the jwt.verify catch block
            return res.status(401).json({ message: 'Authentication failed: Invalid or expired token.' });
        }
        
        // Find user and attach email
        // Since the payload of the token is JUST the email string (as per jwt.sign(payload)), 
        // decodedEmail now holds the actual email string.
        
        const user = await User.findOne({ email: decodedEmail });

        if (!user) {
            return res.status(401).json({ message: 'Authentication failed. User not found.' });
        }

        // 3. Attach User Identity to the Request
        req.userEmail = decodedEmail; 
        next();

    } catch (err) {
        // Since we are now handling the error within jwtConfig.verifyEmailToken, 
        // this outer catch should only hit for server/DB errors, not JWT validation.
        console.error('Auth Middleware Outer Error:', err);
        return res.status(500).json({ message: 'Internal server error during authentication.' });
    }
};

module.exports = authMiddleware;