var router = require('express').Router();
var fs = require('fs');
var file = fs.readFileSync('issue.out');
var json = JSON.parse(file);
var model = {};
var repos = require('../models/db').repos;

router.get('/:user/:repo/*', function(req, res, next) {
  res.redirect("/" + req.params.user + "/" + req.params.repo);
});

router.get('/:user/:repo', function(req, res, next) {
  model.user = "nullfirm";
  model.repo = "hjs";
  model.partials = {
    head: 'partials/head',
    nav: 'partials/nav',
    content: 'issues2',
    footer: 'partials/footer'
  };
  model.issues = json;
  res.render('layout', model);
});

module.exports = router;
