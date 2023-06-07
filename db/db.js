//jshint esversion: 6
var mysql = require('mysql');
const { db } = require("../config/config");

var pool = mysql.createPool({
    connectionLimit: 6,
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database
});

pool.getConnection((err, connection) => {
    if (err) {
        console.log(err)
        throw err;
    }
    console.log('Sql Client Database connected successfully');
    connection.release();
});

module.exports = { connection: pool };