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

  repos.findOne(model).on('success', function(repo) {
    if (repo) {
      repo.issues.some(function(issue){
        if (issue.number ==  req.params.issue) {
          model = dcopy(repo);
          issue.votes++;
          repos.update(model, repo);
          return true;
        }
      });
      res.end();
    } else {
      next();
    }
  });
});

module.exports = router;
