var router = require('express').Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('layout',
    {
      loggedIn: req.isAuthenticated(),
      partials: {
        head: 'partials/head',
        nav: 'partials/nav',
        content: 'index'
      }
    });
});

module.exports = router;
