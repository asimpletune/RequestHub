var configDB = {
  'url' : 'mongodb://192.168.59.103:27017'
};

var MongoClient = require('mongodb').MongoClient;
var db;

module.exports = function(callback) {
  if (db) {
    callback(null, db);
  }
  else {
    MongoClient.connect("mongodb://192.168.59.103:27017/", function(error, database) {
      db = database;
      callback(error, db);
    });
  }
}
