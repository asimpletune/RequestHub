var router = require('express').Router();
var https = require('https');
var Issues;
require('../models/db')( function(err, database){
  if (err) throw err;
  else Issues = database.collection("issues");
});
var passport = require('passport');

router.post('/:user/:repo/:issue', ensureAuthenticated, function(req, res, next) {
	Issues.findAndModify(
		{ "number": Number(req.params.issue),
			"votes" : { $nin : [req.user.github.login]} },
		[['_id','asc']],
		{ $push: { "votes" : req.user.github.login }},
		{ "new" : true }, function(err, document){
			if (err) throw error;
			else {
				res.json(document.value);
			}
		});
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
	res.json({"redirect": "/login"})
}

module.exports = router;
