var router = require('express').Router();
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var settings = require('../config/settings')
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
      { "github.id" : profile.id },
      [['_id','asc']],
      { $set: { 'github': profile._json } },
      { "new": true, upsert: true },
      function(err, doc) {
          if (err){
              console.warn(err.message);
              done(err);
          }else{
              doc.value.github.accessToken = accessToken;
              done(null, doc.value);
          }
      });
  })
);

router.use(session({
  secret: settings.session.secret,
  store: store,
  resave: false,
  saveUninitialized: false
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
