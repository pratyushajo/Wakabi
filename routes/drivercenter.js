var express = require('express');
var router = express.Router();
var pg = require('pg');
var sys = require('sys');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/localdb';


router.get('/remove/:id', function(req, res, next) {
  var driverNum = req.params.id
  pg.connect(connectionString, function(err, client) {
    if (!err) {
      var queryString = "DELETE FROM drivers WHERE license_number = '" + driverNum + "'";
      var query = client.query(queryString, function(err, result) {
        if (!err) {
		  res.redirect('/drivercenter')
          //res.success()
        } else {
          res.error()
        }
        client.end();
      });
    } else {
      res.error()
    }
  });
});


/* GET driver center page. */
router.get('/', function(req, res, next) {
  var params = {
    tab: 'Drivers',
    drivers: null,
    currentDriver: null
  }
  console.log("in drivercenter ");
  pg.connect(connectionString, function(err, client) {
    if (!err) {
      var query = client.query("SELECT * FROM drivers", function(err, result) {
        if (!err) {
          params.drivers = result.rows
          params.currentDriver = (req.query.driver != null) ? req.query.driver : null
          //console.log("Driver num in remove id " + params.currentDriver);
          res.render('drivercenter', params)
        } else {
          // Error
          sys.log("index.js: Error querying DB for drivers, " + err);
          res.render('drivercenter', params)
        }
      });
    } else {
      // Error
      sys.log("index.js: Error connecting to DB, " + err);
      res.render('drivercenter', params)
    }
  });
});


module.exports = router;
