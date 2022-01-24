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

// gets time in fifteen minutes for cookie expiration generation
var inFifteenMinutes = new Date(new Date().getTime() + 15 * 60 * 1000);

app.get('/', function (req, res) {
    console.log(`[/]: Get request received at '/'`);
    res.sendFile('public/start.html', { root: __dirname });
})

app.get('/dashboard', function (req, res) {
    console.log(`[/dashboard]: Get request received at '/dashboard'`);
    res.sendFile('public/dashboard.html', { root: __dirname });
})

app.get('/checkUser', function (req, res) {
    if (req.cookies.Availy) {
        console.log(req.cookies.Availy)
        // if cookie defined exists
        connection.query(`SELECT * FROM ${process.env.DATABASE}.userinfo WHERE cookie = ?`, [req.cookies.Availy], function (error, results, fields) {
            if (results.length > 0) { res.send('1'); } else { res.send('0'); }
        });
    } else { res.send('0') }
})
app.get('/bypass', function (req, res) {
    if (req.cookies.Availy) {
        connection.query(`SELECT * FROM ${process.env.DATABASE}.userinfo WHERE cookie = ?`, [req.cookies.Availy], function (error, results, fields) {
            if (results.length > 0) { res.send('1'); } else { res.send('0'); }
        });
    } else {
        res.send('0')
    }
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
                    var today = new Date();
                    var date = today.getFullYear() + '.' + (today.getMonth() + 1) + '.' + today.getDate();
                    var time = today.getHours() + "." + today.getMinutes() + "." + today.getSeconds();
                    var dateTime = date + '-' + time;
                    connection.query(`UPDATE ${process.env.DATABASE}.userinfo SET cookie = '${body[0]}:${dateTime}' WHERE username = ?`, [body[0]], function (error, results, fields) {
                        if (!!error) {
                            res.send('Login Failed');
                        } else {
                            // cookie successfully updated
                            res.cookie(`Availy`, `${body[0]}:${dateTime}`, { expires: inFifteenMinutes });
                            res.send('Login Successful');
                        }
                    });
                } else {
                    // no account found
                    res.send('1');
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
                                var today = new Date();
                                var date = today.getFullYear() + '.' + (today.getMonth() + 1) + '.' + today.getDate();
                                var time = today.getHours() + "." + today.getMinutes() + "." + today.getSeconds();
                                var dateTime = date + '-' + time;
                                // sets body[0], body[1], body[2], and body[3] into a userinfo
                                connection.query(`INSERT INTO ${process.env.DATABASE}.userinfo (username, email, password, employer, cookie) VALUES ('${body[0]}', '${body[1]}', '${body[2]}', '${body[3]}', '${body[0]}:${dateTime}');`, function (error, result, field) {
                                    // if insert executes unsuccessfully
                                    if (!!error) {
                                        console.log('[/create]: There was an issue creating account');
                                        console.log(error);
                                        res.send('Sorry! There was an issue creating your account. Try reloading.');
                                    } else {
                                        console.log('[/create]: Success creating account!');
                                        res.cookie(`Availy`, `${body[0]}:${dateTime}`, { expires: inFifteenMinutes });
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