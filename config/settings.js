var overrides = require('./settings.override');

module.exports = {
  "github" : {
    "CLIENT_ID": "<REPLACE>",
    "SECRET_KEY": "<REPLACE>"
  },
  "session" : {
    "secret": "<REPLACE>"
  },
  "db" : {
    "url": overrides.db.url || "localhost",
    "name": overrides.db.name || "test"
  }
}
