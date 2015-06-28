var router = require('express').Router();
var https = require('https');
var Issues = require('../models/db').issues;

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
  },
  model = {
    "user" : req.user,
    "author" : req.params.user,
    "repo" : req.params.repo,
    "issues" : [],
    "partials" : {
      head: 'partials/head',
      nav: 'partials/nav',
      content: 'issues2'
    }
  };  

  if (req.user) {
    options.headers.Authorization = "token " + req.user.github.accessToken;
  }

  https.get(options, function(response) {
    var data = '';
    response.on('data', function(d) { data += d; });
    response.on('end', function(d) {
      switch (response.statusCode) {
        case 200:
          var repoIssues = JSON.parse(data);
          var update;
          repoIssues.forEach(function(issue) {
            update = Issues.findAndModify(
              { "id": issue.id },
              { $set : issue , $setOnInsert : { "votes" : [] } },
              { "new": true, "upsert": true })
            .on('success', function(updated) {
              model.issues.push(updated);
            }).on('error', function(err) {
              console.log("ERROR: " + err);
            });
          });
          if (update) {
            update.on('success', function(){ 
              res.render('layout', model); 
            });
          } else {
            console.log("WUPS");
          }
      default:
        break;
            }
    });
  }).on('error', function(err) {
    console.log("ERROR: " + err);
  });
});

module.exports = router;
