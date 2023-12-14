const User = require("../model/userModel")
const Joi = require("joi")
const bcrypt = require("bcrypt")
const chalk = require('chalk');
const jwt = require('../utils/jwt')



// Password validation schema Through joi
const passwordValidation = Joi.string()
  .pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}":;<>,.?~\\-]).{8,}$/)
  .required()
  .messages({
    'string.pattern.base': 'Password must contain at least 1 uppercase letter, 1 number, 1 special character, and be at least 8 characters long.',
    'any.required': 'Password is required.',
  });


// Define schema for user signup

const signupSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: passwordValidation,
    phone: Joi.string().required(),
});

// Define schema for user login

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password:Joi.string().required()
});



// MiddleWare to validate login request

const authController = {
    async signup(req, res){
        try{
            // Validating the req body using thje signup schema
            const { error} = signupSchema.validate(req.body);
            if(error){
                return res.status(400).json({ message: error.details[0].message});

            }

            const {name, email, password, phone} = req.body;
            // Check if the user already exists
            const existingUser = await User.findOne({email});
            if(existingUser){
                return res.status(400).json({message: "email already exists."})
            }

            // hashig the password
            const hashedPass = await bcrypt.hash(password,10);
            // Creating new user in database
            const newUser = new User({
                name,
                email, 
                password: hashedPass,
                phone
            });

            // Save the user in the database
            const user = await newUser.save();
            return res.status(200).json({message:"User registered."})
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
    }
}









module.exports = authController;













