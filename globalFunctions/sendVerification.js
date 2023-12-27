const nodemailer = require('nodemailer');
const path = require('path');
const dotenvPath = path.resolve(__dirname, '../.env'); // Adjust the path as needed
require('dotenv').config({ path: dotenvPath });
const jwt = require('../utils/jwt')


function sendVerificationEmail(user){
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const verificationLink =jwt.sign(user.email)
    const mailOptions = {
        from: 'no-reply@gmial.com',
        to: user.email,
        subject: "Email Verification",
        text: `Click the following link to verify your email:  http://localhost:8000/api/users/verify/${verificationLink}`

    };

    transporter.sendMail(mailOptions, (error, info)=>{
        if(error){
            console.error(`Error sending verification email:`,error);

        }else{
            console.log('Verification email sent:', info.response);
        }
    });
}



module.exports = sendVerificationEmail; 