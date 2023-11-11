var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123",
    database: "test"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("SELECT * FROM user", function (err, result, fields) {
        if (err) throw err;
        console.log(result[0].username, result[0].email, result[0].password);
    });

});
