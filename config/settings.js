var overrides = require('./settings.override');

module.exports = {
  "github" : {
    "CLIENT_ID": overrides.github.CLIENT_ID || "<REPLACE>",
    "SECRET_KEY": overrides.github.SECRET_KEY || "<REPLACE>"
  },
  "session" : {
    "secret": overrides.session.secret || "<REPLACE>"
  },
  "db" : {
    "url": overrides.db.url || "localhost",
    "name": overrides.db.name || "test"
  }
}
