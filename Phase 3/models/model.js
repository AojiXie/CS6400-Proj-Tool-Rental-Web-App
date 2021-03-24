var mysql = require('mysql');


var connection = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password:'9876',
    database:'tools4rent'
});
connection.connect();

module.exports = connection;