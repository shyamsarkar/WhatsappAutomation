const express = require("express");
var cors = require('cors')
const fs = require('fs');
var mysql = require('mysql');
const bodyParser = require("body-parser")


var response_object = { qr: "", authenticated: "", auth_failure: "", ready: "" };

const SESSION_FILE_PATH = './session.json';

let sessionData;
if (fs.existsSync(SESSION_FILE_PATH)) {
   sessionData = require(SESSION_FILE_PATH);
}


const { Client, LegacySessionAuth } = require('whatsapp-web.js');
const client = new Client({
   puppeteer: { headless: true },
   authStrategy: new LegacySessionAuth({
      session: sessionData
   })
});



const app = express();

app.use(bodyParser.urlencoded({
   extended: true
}));

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

con.connect(function (err) {
   if (err) throw err;
});





// QR code Received
client.on('qr', qr => {
   console.log(qr);
   response_object.qr = qr;
});



// QR Scan Success
client.on('authenticated', (session) => {
   console.log('AUTHENTICATED');
   response_object.authenticated = "success";

   sessionData = session;
   fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
      if (err) {
         console.error(err);
      }
   });
});



// QR Scan Failed
client.on('auth_failure', msg => {
   // Fired if session restore was unsuccessful
   console.error('AUTHENTICATION FAILURE', msg);
   response_object.auth_failure = "success";
});


client.on('ready', () => {
   console.log('Client is ready!');
   response_object.ready = "success";
});





app.post("/open_qr", function (req, res) {
   var email1 = req.body.email;
   var password1 = req.body.password;
   console.log(email1, password1);
   con.query("SELECT * FROM user where email='" + email1 + "' and password='" + password1 + "'", function (err, result, fields) {
      if (err) throw err;
      if (result.length > 0) {
         console.log(result.length);
         client.initialize();
         res.end(JSON.stringify(response_object));
      }
   });



});

app.get("/", function (req, res) {
   res.send({ "data": "Scan QR Code" });
});

app.post("/show_qr", function (req, res) {
   res.send(JSON.stringify(response_object));
});




app.post("/send_message", function (req, res) {
   var mobile = req.body.mobile;
   var form_msg = req.body.form_msg;
   console.log(mobile);
   number = "91" + mobile + '@c.us';
   console.log(number);
   client.sendMessage(number, form_msg);
   res.send({ "Data": number });
});




// , "192.168.0.11"

app.listen(5000, function () {
   console.log("server is running on port 5000");
})