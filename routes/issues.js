var express = require('express');
var router = express.Router();
var https = require('https');

var repos = require('../db').repos;
// repos.drop();

/* GET a GitHub repo. */
router.get('/:user/:repo', function(req, res, next) {
  var headers = { 'User-Agent': 'node' },
  options = {
    hostname: 'api.github.com',
    port: 443,
    path: "/repos/" + req.params.user + "/" + req.params.repo + "/issues",
    method: 'GET',
    headers: headers
  }, model = {
    "repo" : req.params.repo,
    "user" : req.params.user
  };

  https.get(options, function(response) {
    if (response.statusCode == 200) {
      var data = '';
      response.on('data', function(d) { data += d; });
      response.on('end', function(d) {
        repos.findOne(model).on('success', function(repo) {
          if (repo == null) {
            model.issues = JSON.parse(data);
            model.issues.forEach(function(issue){ issue.votes = 0; });
            repos.insert(model, function(error, doc){
              if (error) throw error;
              else {
                console.log("Added:")
                console.log(doc);
              }
            });
          } else {
            model = repo;
          }
          res.render('issues', model);
        });
      });
    } else {
      next();
    }
  }).on('error', function(e) {
    console.error(e);
  });
});

module.exports = router;
