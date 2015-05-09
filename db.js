var configDB = require('./config/database.js');
var db = require('monk')(configDB.url);
var users = db.get('users');
var repos = db.get('repos');
users.index('name last');

module.exports = {
  "users" : users,
  "repos" : repos
}
