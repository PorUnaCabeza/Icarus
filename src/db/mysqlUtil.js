/**
 * Created by cabeza on 2018/2/10.
 */
const config = require("../../config/dbConfig");
const mysql = require('mysql');
const connection = mysql.createConnection(config);
connection.connect();
const test = function () {
  connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
  });
};

const close = function () {
  connection.end();
}

module.exports = {
  close,
  test
};
