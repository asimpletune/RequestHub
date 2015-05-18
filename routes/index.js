var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('layout',
    {
      partials: {
        head: 'head',
        nav: 'nav',
        content: 'index'
      }
    });
});

module.exports = router;
