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

function mysqlInsert(table, value){
    value.created_at = getSqlDatetime();
    const sql = 'INSERT INTO '+ table + ' SET ?';
    con.query(sql, value, function(err, result, fields){
        if (err) throw err;
        console.log(result)
    })
}

function mysqlSelect(table, cond, raw, callback){
    const sql = 'SELECT * FROM '+ table + ' WHERE ? ' + raw;
    con.query(sql, cond, function(err, result, fields){
        if (err) throw err;
        callback(result)
    })
}

//ユーザーデータを本登録する
exports.userRegister = function userRegister(code, res){
    //const sql = 'SELECT * FROM `pre_users` WHERE code = ? AND created_at >= (CURRENT_TIMESTAMP - INTERVAL 1 HOUR)';
    const sql = 'SELECT * FROM `pre_users` WHERE created_at ';
    con.query(sql, code, function(err, result, fields){
        if (err) throw err;
        if(!result[0]){
            return "aaaa"
        } else {
            return "bbbb"
            /*
            let data = {
                name: result[0].name,
                email: result[0].email,
                password: result[0].password,
                languague: result[0].languague,
            }
            mysqlInsert('users', data);
            */
        }
    })
    console.log(x)
}
/*
function userRegister(code, callback){
    con.query(sql, code, function(err, result, fields){
        callback(null,result[0].hexcode);
    }
}

function update(){
    function(err,data){
        if (err) {
            // error handling code goes here
            console.log("ERROR : ",err);            
        } else {            
            // code to execute on data retrieval
            console.log("result from db is : ",data);   
        }
}
*/

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

exports.insert = mysqlInsert;
exports.select = mysqlSelect;