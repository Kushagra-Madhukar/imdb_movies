const express = require('express')
const app = express()
const dotenv = require('dotenv')
const cookieParser = require("cookie-parser");
const cors = require('cors');
const path = require('path')

app.use(cors(
    {
        origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5000'],
        optionsSuccessStatus: 200,
        methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
        credentials: true,
        allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
    }
))

require('./config/user_database');
require('./Models/user');
require('./Models/movie')

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

dotenv.config()

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,'..', 'client','build')));

    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html')); // relative path
    });
}


const port = process.env.PORT || 5000
app.listen(port,() => console.log(`app listening on port ${port}`))
app.use(require('./routes'));