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
    Users.findAndModify({
        query: { github : {id: profile.id} },
        update: { $set: { 'github': profile._json } }
      }, { new: true, upsert: true }).on('success', function(doc) {
      done(null, doc);
    }).on('error', function(err) {
      done(err, doc);
    });
  })
);

/* Build user model once, upstream from everything */
router.get('/*', function(req, res, next) {
  req.app.user = {
    isLoggedIn : req.isAuthenticated()
  };
  next();
});

router.get('/login', function(req, res, next) {
  res.redirect('/auth/github');
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

router.get('/auth/github',
  passport.authenticate('github'),
  function(req, res){});

router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

module.exports = router;
