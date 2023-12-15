const jwt = require('jsonwebtoken')

const secretKey = "Neon"

const jwtConfig = {
    sign(payload){
        const token = jwt.sign(payload, secretKey)
        return token
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