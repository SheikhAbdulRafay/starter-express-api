//jshint esversion: 6
// var mysql = require('mysql2');
const { db } = require("../config/config");
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'investmentcoin'
});
module.exports = connection;

// connection.connect((error) => {
//     if (error) {
//         console.error('Error connecting to MySQL server:', error);
//         return;
//     }
//     console.log('Connected to MySQL server.');

//     // Perform database operations here

//     return connection;
// });
