require('dotenv').config();
const cookieParser = require('cookie-parser');
var express = require('express');
var mysql = require('mysql');

var app = express();
app.use(cookieParser());
app.use(express.static('public'));
var server = app.listen(80, '0.0.0.0', function () {
    console.log('Server is listening on port 80');
})

var connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.MYSQLUSERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

connection.connect(function (error) {
    if (!!error) {
        console.log(error);
    } else {
        console.log('Database Connected');
    }
})

app.get('/', function (req, res) {
    console.log(`[/]: Get request recieved at '/'`);
    res.sendFile('public/start.html', { root: __dirname });
})