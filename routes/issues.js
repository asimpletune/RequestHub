var express = require('express');
var router = express.Router();

/* GET a GitHub repo. */
router.get('/:user/:repo', function(req, res, next) {
  res.render('issues',
    {
      title: 'Issues',
      user: req.params.user,
      repo: req.params.repo
    });
});

module.exports = router;
