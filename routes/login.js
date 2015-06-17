var router = require('express').Router();
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var settings = require('../config/settings')
var GITHUB_CLIENT_ID = settings["github"]["CLIENT_ID"];
var GITHUB_CLIENT_SECRET = settings["github"]["SECRET_KEY"];
var User = require('../models/db').users;

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the GitHubStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
passport.use(new GitHubStrategy({
    clientID: settings.github.CLIENT_ID,
    clientSecret: settings.github.SECRET_KEY,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.insert({githubId: profile.id}, function (err, user) {
      return done(err, user);
    });
  })
);

router.get('/login', function(req, res, next) {
  res.redirect('/auth/github');
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
})

// GET /auth/github
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHubwill redirect the user
//   back to this application at /auth/github/callback
router.get('/auth/github',
  passport.authenticate('github'),
  function(req, res){
  });

router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

module.exports = router;
