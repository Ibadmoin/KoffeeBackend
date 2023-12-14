const express = require('express')
const ConnectDb = require('./db/db');
const cors = require('cors');
const chalk = require('chalk');
const app = express()
require('dotenv').config({path:'./.env'})
const Port = 8000 || process.env.Port;
const UserRouter = require('./routes/userRoutes');

app.use(express.json())
app.use(cors())



// Apis
app.use('/api',UserRouter);

// connecting with database
ConnectDb();














// Listenning server

app.listen(Port,()=>{
    console.log(chalk.gray(`Server is running on port ${Port}`))
})