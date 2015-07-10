var router = require('express').Router();
var https = require('https');
var Issues;
require('../models/db')( function(err, database){
  if (err) throw err;
  else Issues = database.collection("issues");
});
var passport = require('passport');

router.post('/:user/:repo/:issue', function(req, res, next) {
	if (req.isAuthenticated()) {
		console.log(req.user.github.login);
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
	} else {
		res.json({"redirect": "/login"})
	}
});

module.exports = router;
