var router = require('express').Router();
var https = require('https');
var repos = require('../models/db').repos;

router.get('/:user/:repo/*', function(req, res, next) {
  res.redirect("/" + req.params.user + "/" + req.params.repo);
});

router.get('/:user/:repo', function(req, res, next) {
  var options = {
    hostname: 'api.github.com',
    port: 443,
    path: "/repos/" + req.params.user + "/" + req.params.repo + "/issues",
    method: 'GET',
    headers : {
      'User-Agent': 'node'
    }
  }, model = {
    "user" : req.params.user,
    "repo" : req.params.repo
  };

  if (req.user) {
    options.headers.Authorization = req.user.github.accessToken;
  }

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
          model.user = req.user;
          model.partials= {
            head: 'partials/head',
            nav: 'partials/nav',
            content: 'issues2'
          };
          res.render('layout', model);
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
