const User = require("../model/userModel")
const Joi = require("joi")
const bcrypt = require("bcrypt")
const chalk = require('chalk');
const jwt = require('../utils/jwt');
const nodemailer = require('nodemailer');
const sendVerificationEmail = require('../globalFunctions/sendVerification');
const otpGenerator = require('otp-generator');
const sendOtpEmail = require('../globalFunctions/sendOtpEmail');
const path = require('path');
require('dotenv').config({ path: '../.env' });



const Constants ={
    Domain : process.env.DOMAIN_URL,
}

// Password validation schema Through joi
const passwordValidation = Joi.string()
  .pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}":;<>,.?~\\-]).{8,}$/)
  .required()
  .messages({
    'string.pattern.base': 'Password must contain at least 1 uppercase letter, 1 special character, and be at least 8 characters long.',
    'any.required': 'Password is required.',
  });


// Define schema for user signup

const signupSchema = Joi.object({
    userName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: passwordValidation,
    phone: Joi.string().required(),
});

// Define schema for user login

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password:Joi.string().required()
});

// Password update schema

// ✅ NEW: Schema for Logged-In User Changing Password (Requires current password)
// NEW: Schema for Logged-In User Changing Password
const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().required(), // <--- Must be defined as required!
    newPassword: passwordValidation,
    confirmPassword: passwordValidation,
});
// Update user Joi Schema (Your original updateUserSchema remains the same)
const updateUserSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    password: passwordValidation,
    phone: Joi.string()
}).or('name', "email", 'password', 'phone');


// Delete user admin schema
const detelUserSchema = Joi.object({
    email: Joi.string().email().required(),
    adminPass :  Joi.string().required().valid('neon101')
});

const forgetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
    newPassword: passwordValidation,
    confirmPassword: passwordValidation,
    otp: Joi.string().length(4).required().messages({'string.length': 'OTP must be 4 digits.'}), // Added length check
    email: Joi.string().email().required(),
});

// MiddleWare to validate login request

const authController = {
    async register(req, res){
        try{
            // Validating the req body using thje signup schema
            const { error} = signupSchema.validate(req.body);
            if(error){
                return res.status(400).json({ message: error.details[0].message});

            }

            const {userName, email, password, phone} = req.body;
            // Check if the user already exists
            const existingUser = await User.findOne({email});
            if(existingUser){
                if(!existingUser.verified){

                    return res.status(400).json({message:{head:'Email already Registered.',text:'Please check your email for verification.'}})
                }else{
                    return res.status(400).json({message: "Email already exists."})
                }
            }

            // hashig the password
            const hashedPass = await bcrypt.hash(password,10);
            // Creating new user in database
            const newUser = new User({
                userName,
                email, 
                password: hashedPass,
                phone
            });
            


            // Save the user in the database
            const user = await newUser.save();

            const verificationToken = jwt.sign(email);
            
           await sendVerificationEmail(user);

            return res.status(200).json({message:{head:'Registration successful.',text:'please check your email for verification.'},user, verificationToken})
        }catch (err){
            res.status(500).json({message: "Internal server eroor.", error: err.message});
        }
    },

    // Login Req
    async login(req,res){
        try{

            // Validating the req body using the login schema
            const {error} = loginSchema.validate(req.body);

            if(error){
                return res.status(400).json({message: error.details[0].message});
            }

            const {email, password}= req.body
            // Find the user  by email
            const user = await User.findOne({email});

            if(!user){
                return res.status(400).json({message:"Invalid email or password"});
            }
            if (!user.verified) {
                return res.status(400).json({ message:{head:"Account not verified.",text:"Please check your email for verification."}});
            }

            // Comparing provided Password with Stored hashed password
            console.log(user.password)

            const isPasswordValid = await bcrypt.compare(password, user.password);
            console.log(chalk.red(isPasswordValid))
            if(!isPasswordValid){
                return res.status(400).json({message:"Invalid Password"})
            }

            // generating a JWt token and set is as a cookie
            const token = jwt.sign(email);

            // Successfully login status
            return res.status(200).json({message: "Login Successfully.",user,token})



        }catch(err){
            res.status(500).json({message: "Internal server error.", error: err.message});
        }
    },
    async updateUser(req,res){
        try{
            // Validate the req body using the update userSchema

            const {error} = updateUserSchema.validate(req.body);
            if(error){
                return res.status(400).json({message:error.details[0].message});

            }
            const {email}= req.body;

            // checking if the user exists
            const user = await User.findOne({email});

            const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

            if(!user){
                return res.status(400).json({message: "User not found"});
            }
            if(!isPasswordValid){
                return res.status(400).json({message:"Incorrect Password!"});
            }

            if(req.body.name){
                user.name = req.body.name; 
            }

            if(req.body.email){
                user.email = req.body.email; 
            }

            const hashedPass = await bcrypt.hash(req.body.password, 10);

            if(req.body.password){
                user.password = hashedPass; 
            }

            if(req.body.phone){
                user.phone = req.body.phone; 
            }

            // Saving updated details
            await user.save();

            res.json({message: "user updated successfully", success:true,user});
        }catch(err){
            return res.status(500).json({message:err});
        }
    },
    // delete User
      async deleteUser(req,res){
        try{

            const {error} = detelUserSchema.validate(req.body);
            if(error){
                return res.status(400).json({message:error.details[0].message});
            }
            const {email, adminPass} = req.body;

            // checking if the user exists or not in db
            const user = await User.findOne({email});

            if(!user){
                return res.status(400).json({message:"No user found!"});
            }
            // deleting the user from the database
           if(adminPass == "neon101"){
            await User.deleteOne({email:email});
            return res.status(200).json({message: "Successfully deleted User", user});
           }



        }catch(err){
            return res.status(500).json({message:"could'nt delete user"})
        }

    },
    // verify email function
    async verifyEmail(req,res){
    try{
        const token = req.params.token;
        console.log(req.params)
        console.log("token here",token)
        const decodedToken = jwt.verifyEmailToken(token);
        console.log("Decorded Token", decodedToken)
        const user = await User.findOne({email: decodedToken});
        if(!user){
            return res.status(404).json({message:"User not found"});

        }
        user.verified = true;
        await user.save();
        console.log("User clicked...");
        console.log(Constants.Domain)
        return res.redirect(`${Constants.Domain}/verification.html`);
        
    }catch(err){
        if(err.name=== "TokenExpiredError"){
            return res.status(400).json({message:'Token has expired'})
        }else{
            return res.status(500).json({message:"Internal server error",error: err.message})
        }
    }
   
    },
async forgetPassword(req, res) {
        try {
            const { error } = forgetPasswordSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const { email } = req.body;
            const user = await User.findOne({ email });
            
            if (!user) {
                // Return a generic success message for security reasons
                return res.status(200).json({ message: 'If a matching user was found, a password reset OTP has been sent.' });
            }

            const otp = otpGenerator.generate(4, { digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });

            // ✅ Save OTP and set Expiration to 10 minutes
            user.passwordResetOtp = otp;
            user.passwordResetExpires = Date.now() + 600000; // 10 minutes (600,000 ms)
            await user.save();

            await sendOtpEmail(user, otp);
            return res.status(200).json({ message: "Password reset OTP sent. Check your email." });

        } catch (err) {
            console.error('Forget Password Error:', err);
            res.status(500).json({ message: 'Internal server error', error: err.message });
        }
    },

    // 2. 🔄 Reset Password (Completes OTP flow - NEW FUNCTION)
    async resetPassword(req, res) {
        try {
            const { error } = resetPasswordSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const { newPassword, confirmPassword, otp, email } = req.body;

            // ✅ Find user by email, matching OTP, and ensure OTP is NOT expired
            const user = await User.findOne({
                email,
                passwordResetOtp: otp,
                passwordResetExpires: { $gt: Date.now() } // $gt means "greater than" current time (i.e., not expired)
            });

            if (!user) {
                // Covers both invalid OTP and expired OTP
                return res.status(400).json({ message: "Invalid or expired OTP." });
            }
            
            if (newPassword !== confirmPassword) {
                return res.status(400).json({ message: "New and confirm password do not match." });
            }

            // Hash and Save the new password
            user.password = await bcrypt.hash(newPassword, 10);
            
            // ✅ Clear the OTP fields after successful use
            user.passwordResetOtp = undefined;
            user.passwordResetExpires = undefined; 
            await user.save();

            return res.status(200).json({ message: "Password reset successfully. You can now log in." });

        } catch (err) {
            console.error("Reset Password Error:", err);
            return res.status(500).json({ message: 'Internal server error during password reset.' });
        }
    },
    
    // 3. 📝 Update Password (Logged-In User Change)
    // NOTE: Requires a dedicated Authentication Middleware to set req.userEmail
    async updatePassword(req, res) {
        try {
            // Use the new schema that requires the current password
            const { error } = changePasswordSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const { currentPassword, newPassword, confirmPassword } = req.body;
            
            // 1. Get user email from the JWT (SET BY AUTH MIDDLEWARE)
            const email = req.userEmail; // <-- ENSURE YOUR MIDDLEWARE SETS THIS!

            // 2. Find the user
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }

            // 3. Verify the CURRENT password
            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isCurrentPasswordValid) {
                return res.status(400).json({ message: "Incorrect current password." });
            }

            // 4. New Password Confirmation Check
            if (newPassword !== confirmPassword) {
                return res.status(400).json({ message: "New and confirm password do not match." });
            }

            // 5. Hash and Save the new password
            user.password = await bcrypt.hash(newPassword, 10);
            await user.save();

            return res.status(200).json({ message: "Password updated successfully." });

        } catch (err) {
            console.error("Update Password Error:", err);
            // Handle cases where req.userEmail is missing (middleware failed) or other errors
            return res.status(500).json({ message: "Internal server error during password update." });
        }
    },
};




module.exports = authController;













