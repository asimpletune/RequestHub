var router = require('express').Router();
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var settings = require('../config/settings')
var GITHUB_CLIENT_ID = settings["github"]["CLIENT_ID"];
var GITHUB_CLIENT_SECRET = settings["github"]["SECRET_KEY"];
var Users = require('../models/db').users;

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
        { $set: { 'github': profile._json } },
        { "new": true, upsert: true })
    .on('success', function(doc) {
      doc.github.accessToken = accessToken;
      done(null, doc);
    }).on('error', function(err) {
      done(err);
    });
  })
);

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
