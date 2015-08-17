var express = require('express');
var router = express.Router();
var pg = require('pg');
var sys = require('sys');

//Get Login page
router.get('/', function(req, res, next) {
	res.render('login');
});

var getLoginCredentials = function(req, res, next) {
	var username = req.params;
	var password = req.body.password;
	console.log(username);
}

router.post('/home',function(req,res){
	console.log(req.body) //you will get your data in this as object.
	var username = req.body.username;
	var password = req.body.password;
	
	pg.connect(process.env.DATABASE_URL, function(err, client) {
	    if (!err) {
	      // Check if username and password match
	      var query = client.query("SELECT password FROM users WHERE username= '" + username + "'", function(err, result) {
	        if (!err) {
	          if (result.rows.length == 0) {
	            sys.log("No user found");
	          } else {
	            sys.log("user found");
	            res.render('index');
	          }
	        } else {
	          sys.log("login: Error querying DB " + err);
	        }

	        client.end();
	      });
      } else {
        sys.log("login: Error connecting to DB, " + err);
      }
    });
   
})

module.exports = router;