var router = require('express').Router();
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var settings = require('../config/settings')
var GITHUB_CLIENT_ID = settings["github"]["CLIENT_ID"];
var GITHUB_CLIENT_SECRET = settings["github"]["SECRET_KEY"];
var Users;
require("../models/db")(function(err, database) {
  if (err) throw err;
  else Users = database.collection("users");
});

var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

var store = new MongoDBStore( { uri: 'mongodb://192.168.59.103:27017', collection: 'mySessions' } );

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GitHubStrategy({
    clientID: settings.github.CLIENT_ID,
    clientSecret: settings.github.SECRET_KEY,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    Users.findAndModify(
      { "github.id" : profile.id }, // query
      [['_id','asc']],  // sort order
      { $set: { 'github': profile._json } }, // replacement, replaces only the field "hi"
      { "new": true, upsert: true }, // options
      function(err, doc) {
          if (err){
              console.warn(err.message);  // returns error if no matching object found
              done(err);
          }else{
              doc.value.github.accessToken = accessToken;
              done(null, doc.value);
          }
      });
  })
);

router.use(require('express-session')({
  secret: 'This is a secret',
  store: store
}));

router.use(passport.initialize());
router.use(passport.session());

router.get('/login', function(req, res, err) {
  req.session.redirectUrl = req.header('Referer') || '/';
  res.redirect('/auth/github');
});

router.get('/auth/github', passport.authenticate('github'), function(req, res){});

router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect(req.session.redirectUrl);
  });

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect(req.header('Referer') || '/');
});

module.exports = router;
