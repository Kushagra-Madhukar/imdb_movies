const mongoose = require('mongoose');
const { DB_STRING } = require('../config');

require('dotenv').config();

const devConnection = encodeURI(DB_STRING);
const prodConnection = encodeURI(DB_STRING);

console.log(devConnection)
// Connect to the correct environment database
if (process.env.NODE_ENV === 'production') {
    mongoose.connect(prodConnection, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    mongoose.connection.on('connected', () => {
        console.log('Database connected');
    });
} else {
    mongoose.connect(devConnection, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    mongoose.connection.on('connected', () => {
        console.log('Database connected');
    });
}

