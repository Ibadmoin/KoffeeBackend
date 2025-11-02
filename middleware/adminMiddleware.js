const User = require('../model/userModel'); 

const adminMiddleware = async (req, res, next) => {
    try {
        // 1. Get user identity attached by authMiddleware
        // We explicitly use 'req.userEmail' here to match the setter in authMiddleware.js
        const userEmail = req.userEmail; 

        if (!userEmail) {
            // This case should ideally not be reached if authMiddleware runs first
            return res.status(401).json({ message: 'Access denied. Authentication required.' });
        }
        
        // 2. Find the user in the database
        const user = await User.findOne({ email: userEmail });
        
        // 3. Authorization Check: Must exist AND have the exact role 'admin'
        // This is case-sensitive, matching the standard 'admin' value.
        if (!user || user.role !== 'admin') { 
            console.warn(`Attempted access by non-admin user: ${userEmail} (Role: ${user?.role})`);
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }

        // 4. User is an Admin, proceed to the next handler (multer/controller)
        next();
        
    } catch (err) {
        console.error('Admin Middleware Error:', err);
        // Respond with a generic 500 status for internal errors like DB connection failure
        res.status(500).json({ message: 'Internal server error during authorization check.' });
    }
};

module.exports = adminMiddleware;
