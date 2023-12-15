const CoffeeItems = require('../constants')
const express = require('express');

const dataRouter = express.Router();


dataRouter.get('/coffeeitems', (req,res)=>{
    res.json(CoffeeItems)
    console.log("req agai..")
})


module.exports = dataRouter;

