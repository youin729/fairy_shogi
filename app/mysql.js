const mysql = require("mysql");
const con = mysql.createConnection({
    host: 'localhost',
    user: 'este',
    port: 3306,
    password: 'Nrhj8B$n)E'
});

exports.mysqlConnect = function mysqlConnect(){
    con.connect(function(err) {
        if (err) throw err;
        console.log('Connected');
    });
}