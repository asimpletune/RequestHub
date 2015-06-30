var router = require('express').Router();
var https = require('https');
var Issues = require('../models/db').issues;
var passport = require('passport');

router.post('/:user/:repo/:issue', function(req, res, next) { 
	if (req.isAuthenticated()) {
		console.log(req.user.github.login);
		Issues.findAndModify(
			{ "number": Number(req.params.issue),
				"votes" : { $nin : [req.user.github.login]} },				
			{ $push: { "votes" : req.user.github.login }},
			{ "new" : true })
			.on('success', function(updated) {
				console.log("done");
				res.json(updated);
			}).on('error', function(err) {
				console.log("ERROR: " + err);
			});				
	} else {
		res.json({"redirect": "/login"})
	}
});

module.exports = router;
