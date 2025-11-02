const express = require('express')
const ConnectDb = require('./db/db');
const cors = require('cors');
const chalk = require('chalk');
const path = require('path')
const app = express()
require('dotenv').config({path:'./.env'})
const Port = 8000 || process.env.PORT;
const UserRouter = require('./routes/userRoutes');
const dataRouter = require('./routes/dataRoutes');
const productRouter = require('./routes/productRoutes');

console.log(process.env.DOMAIN_URL)

app.use(express.json())
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// Serve static files from the 'redirects' folder
app.use(express.static(path.join(__dirname, 'redirects')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));



// Apis
app.use('/api/users',UserRouter);
app.use('/api/data',dataRouter);
app.use('/api/product',productRouter);
app.use('/',(req,res)=>{
    res.send("Redirecting")
})


// connecting with database
ConnectDb();














// Listenning server

app.listen(Port,()=>{
    console.log(chalk.gray(`Server is running on port ${Port}`))
})