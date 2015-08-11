var settings = require("../config/settings");

var MongoClient = require('mongodb').MongoClient;
var db;

module.exports = function(callback) {
  if (db) {
    callback(null, db);
  }
  else {
    MongoClient.connect(settings.db.url, function(error, database) {
      db = database;
      callback(error, db);
    });
  }
}
