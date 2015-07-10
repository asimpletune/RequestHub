var router = require('express').Router();
var https = require('https');
var Issues;
require('../models/db')( function(err, database){
  if (err) throw err;
  else Issues = database.collection("issues");
});

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
      content: 'issues'
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
          var issueIDs = [];
          var bulk = Issues.initializeUnorderedBulkOp();

          repoIssues.forEach(function(issue) {
            issueIDs.push(issue.id);
            bulk.find( { "id": issue.id } )
            .upsert()
            .update({ $set : issue , $setOnInsert : { "votes" : [] } });
          });

          var bulkResult = bulk.execute(function(err, result) {
            if (err) throw err;
            else {
              Issues.find({ "id": { $in: issueIDs } }, function(err, cursor) {
                cursor.toArray( function(err, doc){
                  model.issues = doc;
                  res.render('layout', model);
                });
              });
            }
          });

      default:
        break;
      }
    });
  }).on('error', function(err) {
    console.log("ERROR: " + err);
  });
});

module.exports = router;
