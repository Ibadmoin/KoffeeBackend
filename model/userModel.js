const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userName: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    password: {type: String, required: true},
    verified: {type: Boolean, default:false},
    passwordResetOtp: { type: String, default: null },
    facvorites:[{type: mongoose.Schema.Types.ObjectId, ref:'Product'}]
   
})


module.exports = mongoose.model("User", UserSchema)