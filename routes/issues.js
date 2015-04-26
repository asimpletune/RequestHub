var express = require('express');
var router = express.Router();
var https = require('https');

/* GET a GitHub repo. */
router.get('/:user/:repo', function(req, res, next) {
  var headers = { 'User-Agent': 'node' };
  var options = {
    hostname: 'api.github.com',
    port: 443,
    path: "/repos/" + req.params.user + "/" + req.params.repo + "/issues",
    method: 'GET',
    headers: headers
  };
  https.get(options, function(response) {
      var data = '';
      response.on('data', function(d) { data += d; });
      response.on('end', function(d) {
        var model = {
          user: req.params.user,
          repo: req.params.repo,
          heading:
          "<tr class='panel-title'>"  +
            "<td>Title</td>"          +
            "<td>Body</td>"           +
            "<td>Author</td>"         +
          "</tr>",
          issues: JSON.parse(data),
        };
        res.render('issues', model);
      });
    }).on('error', function(e) {
      console.error(e);
    });
});

module.exports = router;
