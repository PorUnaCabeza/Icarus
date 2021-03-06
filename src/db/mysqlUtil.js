/**
 * Created by cabeza on 2018/2/10.
 */
const config = require('../../config/dbConfig')
const mysql = require('mysql')

const connection = mysql.createConnection(config)

const init = function() {
  connection.connect(err => {
    if (err) console.log(err)
    else console.log('connected as id ' + connection.threadId)
  })
}

const close = function() {
  connection.end(err => {
    if (err) console.log(err)
    else console.log(' The connection is terminated now')
  })
}

const query = function(sql, arrayParam) {
  return new Promise((resolve, reject) => {
    connection.query(sql, arrayParam, function(error, results) {
      if (error) reject(error)
      resolve(results)
    })
  })
}

const exec = function(s, param) {
  let sql = mysql.format(s, param).replace(/'::(.*?)'/g, '$1')
  //console.log(sql)
  return new Promise((resolve, reject) => {
    connection.query(sql, function(error, results) {
      if (error) reject(error)
      resolve(results)
    })
  })
}

const batchInsert = function(sql, arrayParam) {
  let formattedQuery = mysql.format(sql, [arrayParam]).replace(/'::(.*?)'/g, '$1')
  return new Promise((resolve, reject) => {
    connection.query(formattedQuery, function(error, results) {
      if (error) reject(error)
      resolve(results)
    })
  })
}

module.exports = {
  init,
  close,
  query,
  exec,
  batchInsert
}
