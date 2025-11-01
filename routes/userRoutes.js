const express = require('express');
const authController = require("../controller/userController");
const userRouter = express.Router();
// Assuming you will create this file:
const authMiddleware = require('../middleware/authMiddleware'); // ⬅️ NEW: Import middleware

// --- Public/Unprotected Routes ---
userRouter.post('/register', authController.register);
userRouter.get('/verify/:token', authController.verifyEmail);
userRouter.post('/login', authController.login);
userRouter.post('/forgetpassword', authController.forgetPassword);

// ✅ NEW: Route to finalize the OTP-based password reset
userRouter.post('/resetpassword', authController.resetPassword); 

// --- Protected Routes (Require Authentication Middleware) ---
// The authMiddleware will verify the JWT and attach the user's identity (req.userEmail)
userRouter.post('/updatepassword', authMiddleware, authController.updatePassword); // ⬅️ ADDED authMiddleware
userRouter.post('/updateprofile', authMiddleware, authController.updateUser);     // ⬅️ ADDED authMiddleware

// NOTE: deleteUser is typically an admin function, but we'll protect it too
userRouter.post('/deleteUser', authMiddleware, authController.deleteUser);        // ⬅️ ADDED authMiddleware


// --- Example Route ---
const userlist = [
    {
        name: "ibad",
        id: 1,
    }
];
userRouter.get('/users', (req, res) => {
    res.json(userlist);
});

module.exports = userRouter;