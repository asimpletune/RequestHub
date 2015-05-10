var express = require('express');
var router = express.Router();
var https = require('https');
var repos = require('../db').repos;
var dcopy = require('deep-copy');

/* GET a GitHub repo. */
router.post('/vote/:user/:repo/:issue', function(req, res, next) {
  model = {
      user: req.params.user,
      repo: req.params.repo,
      issues : {
        $elemMatch: { number: Number(req.params.issue) }
      }
  };

  repos.update(model, { "$inc": { "issues.$.votes" : 1 } }, function(error, doc) {
    if (error) throw error;    
    res.end();
  });
});

module.exports = router;
