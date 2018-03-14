/**
 * Created by cabeza on 2018/2/10.
 */
const config = require("../../config/dbConfig");
const mysql = require('mysql');

const connection = mysql.createConnection(config);

const init = function () {
  connection.connect(err => {
    if (err)
      console.log(err);
    else
      console.log('connected as id ' + connection.threadId);
  });
};
const test = function () {
  connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
  });
};

const close = function () {
  connection.end(err => {
    if (err)
      console.log(err);
    else
      console.log(' The connection is terminated now');
  });
};

const query = function (sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, function (error, results) {
      if (error) reject(error);
      resolve(results);
    });
  });
};

const batchInsert  = function (sql, arrayParam) {
  return new Promise((resolve, reject) => {
    connection.query(sql, [arrayParam], function (error, results) {
      if (error) reject(error);
      resolve(results);
    });
  });
};

module.exports = {
  init,
  close,
  test,
  query,
  batchInsert,
  insertKeyLineData
};
