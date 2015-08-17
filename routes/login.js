var express = require('express');
var router = express.Router();
var pg = require('pg');
var sys = require('sys');

//Get Login page
router.get('/', function(req, res, next) {
	res.render('login');
});

router.post('/',function(req,res){
	console.log(req.body) 
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
				if(result.rows[0].password === password){
	            	res.redirect('/home');
				} else {
					sys.log("Invalid password!");
					alert("Invalid password!");
					res.redirect('/login');
				}
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