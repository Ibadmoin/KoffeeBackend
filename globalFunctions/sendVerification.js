const nodemailer = require('nodemailer');
const path = require('path');
const dotenvPath = path.resolve(__dirname, '../.env'); // Adjust the path as needed
require('dotenv').config({ path: dotenvPath });
const jwt = require('../utils/jwt')


 async function sendVerificationEmail(user){
    console.log("preparing to send email..")
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    const Domain = process.env.DOMAIN_URL+"api/users/verify/"
    console.log(Domain)

    const verificationLink =jwt.sign(user.email)
    const mailOptions = {
        from: 'no-reply@gmail.com',
        to: user.email,
        subject: "Email Verification",
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email temp</title>
            <style>
                /* Add your custom styles here */
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 0;
                }
            </style>
        </head>
        <body>
        
            <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff">
                <tr>
                    <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" border="0">
                            <!-- Header Section -->
                            <tr>
                                <td bgcolor="#ffffff" style="padding: 20px 0;">
                                    <h1 style="font-size: 3em; text-align: center; color: #d4a574;">Koffee</h1>
                                </td>
                            </tr>
        
                            <!-- Image Section -->
                            <tr>
                                <td bgcolor="#8c5319" style="padding: 20px; text-align: center;">
                                    <img style="width: 60px;" src="https://res.cloudinary.com/dfhvlndon/image/upload/v1703878200/app%20media/mail_s4qk33.png" alt="Mail Icon">
                                    <h4 style="text-align: center; color: white; text-transform: uppercase; letter-spacing: 5px;">Thanks For Signing Up!</h4>
                                    <h1 style="text-align: center; color: white;">Verify Your E-Mail Address</h1>
                                </td>
                            </tr>
        
                            <!-- Content Section -->
                            <tr>
                                <td style="padding: 20px; color: black; text-align: center;">
                                    <p style="font-size: 16px; font-weight: 500;">Hi,</p>
                                    <p style="font-size: 16px; font-weight: 500; padding: 20px;">You're almost ready to get started. Please click on the button below to verify your email address and enjoy exclusive cleaning services with us!</p>
                                    <a href='${Domain+verificationLink}' style="text-decoration: none;cursor:pointer">
                                        <button style="border: none; padding: 10px; border-radius: 5px; color: white; background-color: #d4a574; cursor: pointer;">VERIFY YOUR EMAIL</button>
                                    </a>
                                    <p style="font-size: 16px; font-weight: 500; color: black;">Thanks.<br/>The Koffee Team.</p>
                                </td>
                            </tr>
        
                            <!-- Footer Section -->
                          <!-- Footer Section -->
        <tr>
            <td bgcolor="#E5EAF5" style="padding: 20px; text-align: center;">
                <h4 style="color: #8c5319; padding: 0;">Get in touch</h4>
                <table width="180" cellspacing="0" cellpadding="0" border="0" align="center">
                  
                    <tr>
                        <td style="padding: 10px; text-align: center;">
                            <a href="https://www.facebook.com/profile.php?id=100008452442648" style="color: #8c5319; text-decoration: none;">
                                <img style="width: 30px; cursor: pointer;" src="https://res.cloudinary.com/dfhvlndon/image/upload/v1703878177/app%20media/facebook_u1fjwi.png" alt="Facebook">
                            </a>
                        </td>
                        <td style="padding: 10px; text-align: center;">
                            <a href="https://www.linkedin.com/in/ibad-moin-2b43a8253/" style="color: #8c5319; text-decoration: none;">
                                <img style="width: 30px; cursor: pointer;" src="https://res.cloudinary.com/dfhvlndon/image/upload/v1703878199/app%20media/linkedin_ymoxxo.png" alt="LinkedIn">
                            </a>
                        </td>
                        <td style="padding: 10px; text-align: center;">
                            <a href="https://www.instagram.com/ibad_moin/" style="color: #8c5319; text-decoration: none;">
                                <img style="width: 30px; cursor: pointer;" src="https://res.cloudinary.com/dfhvlndon/image/upload/v1703878192/app%20media/instagram_veusvz.png" alt="Instagram">
                            </a>
                        </td>
                        <td style="padding: 10px; text-align: center;">
                            <a href="https://github.com/ibadmoin" style="color: #8c5319; text-decoration: none;">
                                <img style="width: 30px; cursor: pointer;" src="https://res.cloudinary.com/dfhvlndon/image/upload/v1703878185/app%20media/github_sipn8w.png" alt="GitHub">
                            </a>
                        </td>
                    </tr>
                </table>
                
            </td>
        </tr>
        
        
                            <!-- Copyright Section -->
                            <tr>
                                <td bgcolor="#8c5319" style="padding: 20px; text-align: center; color: white;">
                                    <p>Copyrights © Kofee All Rights Reserved</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        
        </body>
        </html>
        `

    };
    await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error(`Error sending verification email:`, err);
                console.error(err);
                reject(err);
            } else {
                resolve(info);
                console.log('Verification email sent:', info.response);
            }
        });
    });
    

  
}



module.exports = sendVerificationEmail; 