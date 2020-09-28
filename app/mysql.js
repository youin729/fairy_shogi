const mysql = require("mysql");
const con = mysql.createConnection({
    host: 'localhost',
    user: 'alt_shogi',
    port: 3306,
    password: '&wx%weX;K2',
    database: 'alt_shogi'
});

exports.connect = function mysqlConnect(){
    con.connect(function(err) {
        if (err) throw err;
        console.log('Connected');
    });
}

exports.insert = function mysqlInsert(table, value){

    value.created_at = getSqlDatetime();
    const sql = 'INSERT INTO '+ table + ' SET ?';
    con.query(sql, value, function(err, result, fields){
        if (err) throw err;
        console.log(result)
    })
}




exports.getUsers = function getUsers(){
    
    con.connect(function(err) {
        if (err) throw err;
        console.log('Connected');
    });
}

function getSqlDatetime(){
    let date;
    date = new Date();
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ' + 
        ('00' + date.getUTCHours()).slice(-2) + ':' + 
        ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
        ('00' + date.getUTCSeconds()).slice(-2);
    return date;
}
