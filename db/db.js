const chalk = require('chalk')
const mongoose = require('mongoose');

async function ConnectDb() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
        });
        console.log(chalk.blue.bgGreen.bold("Database Connected Successfully!"));
    } catch (err) {
        console.error(chalk.red(err));
        process.exit(1);
    }
}

module.exports = ConnectDb;
