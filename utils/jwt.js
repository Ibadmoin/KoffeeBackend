require('dotenv').config();
const jwt = require('jsonwebtoken')
const secretKey = process.env.JWT_SECRET;

// Check if the secret key is defined (good practice)
if (!secretKey) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in environment variables.");
    // You might want to exit the process here in production
}

const jwtConfig = {
    sign(payload){
        const token = jwt.sign(payload, secretKey)
        return token
    },
    verifyEmailToken(token){
        try{
            const decoded = jwt.verify(token, secretKey);
            console.log(decoded)
            return decoded
        }catch(err){
            console.log("Error verifying token", err);
            return null

        }

    },
    

    verifyToken(req, res, next){
        const token = req.headers.authorization?.split(" ")[1];

        if(!token){
            return res.status(401).send({error: 'No token provided.'})
        }

        try {
            const decoded = jwt.verify(token, secretKey);
            console.log(decoded);
            req.userId = decoded.userId;
            next();
        }catch (err){
            return res.status(401).json({message:"Invalid token"});
        }
    }
};



module.exports = jwtConfig