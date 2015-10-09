var express = require('express');
var router = express.Router();
var pg = require('pg');
var sys = require('sys');
var moment  = require('moment')
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/localdb';

//Get Login page
router.get('/', function(req, res, next) {
	res.render('addDriver');
});


router.post('/',function(req,res){
	console.log(req.body) 
	var license_number = req.body.license_number;
	var driver_name = req.body.driver_name;
	var stage = req.body.stagepicker;
	var phone_number = req.body.phone_number;
	var recommenders1 = req.body.recommenders1;
	var contact1 = req.body.recommender1con;
	var recommenders2 = req.body.recommenders2;
	var contact2 = req.body.recommender2con;
	var payment_option = req.body.selectpicker;
	//var payment_combo = 
	
	pg.connect(connectionString, function(err, client) {
        if (!err) {
          var queryString = "INSERT INTO drivers (license_number, name, phone_number, number_of_rides_remaining, working, current_zone, has_trailer, rating, last_payment, total_rides_completed, time_last_ride, recommenders1 , recommenders2, recom1contact, recom2contact) VALUES ('"
            + license_number + "','" + driver_name + "','" + phone_number + "','" + payment_option +  "','true', '" + stage + "', 'true', '100%', '" + moment().format('YYYY-MM-DD HH:mm:ssZ') + "', '0', '" + moment().format('YYYY-MM-DD HH:mm:ssZ') + "','" + recommenders1 + "','"  + recommenders2 + "','"  + contact1 + "','"  + contact2 +"')";
			console.log("QueryString: " + queryString);
          var query = client.query(queryString, function(err, result) {
           
            if (!err) {
              console.log("Add Driver: Driver added to DB successfully");
			  res.redirect('/drivercenter');
            } else {
              console.log("Add Driver: Error adding driver to DB, " + err);
			  res.redirect('/addDriver');
            }
            client.end();
          });
        } else {
          // Error connecting to DB
          var errorString = "Error connecting to DB to add driver, " + err;
          console.log("Add Driver: " + errorString);
        }
      });
	  
	  
   
})




module.exports = router;
