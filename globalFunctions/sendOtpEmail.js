const nodemailer = require('nodemailer');
const path = require('path');
const dotenvPath = path.resolve(__dirname, '../.env'); // Adjust the path as needed
require('dotenv').config({ path: dotenvPath });
const jwt = require('../utils/jwt')


function sendOtpEmail(user, otp){
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: 'Koffee@gmail.com',
        to: user.email,
        subject: 'Password Reset OTP',
        text: `Your otp for password reset is ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info)=>{
        if(error){
            console.log(error);

        }else{
            console.log('Email sent: ', info.response)
        }
    })

};


module.exports = sendOtpEmail;