const express = require('express')
const app = express()
var cors = require('cors')
var mysql = require('mysql');
const bodyParser = require("body-parser")

var myresp = { qr: "", authenticated: "", auth_failure: "", ready: "" };

/*  Config section */

// for bypass cors
app.use(cors({
    origin: '*'
}));

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123",
    database: "test"
});

app.use(bodyParser.urlencoded({
    extended: true
}));


con.connect(function (err) {
    if (err) throw err;
});


/* Routing Section */

// GET method route
app.all('/', (req, res) => {
    res.json(myresp)
});

// POST method route
app.post('/open_qr', (req, res) => {
    res.json(myresp)
});

// POST method route
app.post('/show_qr', (req, res) => {
    var email1 = req.body.email;
    var password1 = req.body.password;
    console.log(email1, password1);
    con.query("SELECT * FROM user where email='" + email1 + "' and password='" + password1 + "'", function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
            console.log(result.length);
            //sendMessage();
        }
        res.json(result);
    });
});

app.listen(5000, function () {
    console.log("server is running on port 5000");
});