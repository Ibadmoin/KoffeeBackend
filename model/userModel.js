const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // ⬅️ Added: Ensures no two accounts share an email
        lowercase: true // ⬅️ Added: Good practice for consistency
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    passwordResetOtp: {
        type: String,
        default: null
    },
    // 🔑 Critical Addition for OTP Security
    passwordResetExpires: {
        type: Date,
        default: null
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
    
}, { timestamps: true }); // ⬅️ Added: Automatically creates 'createdAt' and 'updatedAt' fields

module.exports = mongoose.model("User", UserSchema)