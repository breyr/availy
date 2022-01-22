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
    console.log(`[/]: Get request received at '/'`);
    res.sendFile('public/start.html', { root: __dirname });
})

app.post('/login', (req, res) => {
    let body = ''; req.on('data', function (chunk) { body += chunk; });
    req.on('end', function () {
        console.log(`[/login]: Post request received at '/login' (${body})`);
        // if data is received
        if (body) {
            // body[0] = username & body[1] = password
            body = body.split(':');
            // queries for account with the username of body[0] and password of body[1]
            connection.query(`SELECT * FROM ${process.env.DATABASE}.userinfo WHERE username = ? AND password = ?`, [body[0], body[1]], function (error, results, fields) {
                // if users defined exists
                if (results.length > 0) {
                    console.log(`Account Found: U:'${results[0].username}' P:'${results[0].password}'`);
                    res.send('Login Successful');
                } else {
                    console.log('No Account Found');
                    res.send('Incorrect Username and/or Password!');
                }
            });
        } else {
            // if data is not received
            res.send('Body data invalid');
        }
    })
})

app.post('/create', (req, res) => {
    let body = ''; req.on('data', function (chunk) { body += chunk; });
    req.on('end', function () {
        console.log(`[/create]: Post request received at '/create' (${body})`);
        // if data is received
        if (body) {
            // body[0] = username & body[1] = email & body[2] = password & body[3] = employer
            body = body.split(':');
            // queries for account with the username of body[0]
            connection.query(`SELECT * FROM ${process.env.DATABASE}.userinfo WHERE username = ?`, [body[0]], function (error, results, fields) {
                if (results.length > 0) {
                    console.log(`[/create]: Username already taken with the U:${body[0]}`);
                    res.send('Username Already Taken')
                } else {
                    // queries for account with the email of body[1]
                    connection.query(`SELECT * FROM ${process.env.DATABASE}.userinfo WHERE email = ?`, [body[1]], function (error, results, fields) {
                        if (results.length > 0) {
                            console.log(`[/create]: Email already taken with the E:${body[1]}`);
                            res.send('Email Already Taken')
                        } else {
                            // verifies body[3] with env values and replaces with string
                            if (body[3] == process.env.ARCADIAIT) {
                                body[3] = 'ArcadiaIT';
                                // sets body[0], body[1], body[2], and body[3] into a userinfo
                                connection.query(`INSERT INTO ${process.env.DATABASE}.userinfo (username, email, password, employer) VALUES ('${body[0]}', '${body[1]}', '${body[2]}', '${body[3]}');`, function (error, result, field) {
                                    // if insert executes unsuccessfully
                                    if (!!error) {
                                        console.log('[/create]: There was an issue creating account');
                                        console.log(error);
                                        res.send('Sorry! There was an issue creating your account. Try reloading.');
                                    } else {
                                        console.log('[/create]: Success creating account!');
                                        res.send('Create Successful');
                                    }
                                }); // create account
                            } else { res.send('Invalid Employer Code'); }
                        }
                    }); // email detection
                }
            }); // username detection
        } else {
            // if data is not received
            res.send('Body data invalid');
        }
    })
})