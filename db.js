// db.js
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

module.exports = open({
  filename: './db.sqlite',
  driver: sqlite3.Database,
});
