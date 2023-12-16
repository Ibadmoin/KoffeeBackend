const express = require('express');
const authController = require("../controller/userController");
const userRouter = express.Router();


userRouter.post('/signup',authController.signup)
userRouter.post('/login',authController.login)
userRouter.post('/updatepassword',authController.updatePassword)

const userlist = [
    {
        name: "ibad",
        id: 1,
    }
]

userRouter.get('/users',(req, res)=>{
 
    res.json(userlist)
})



module.exports = userRouter;