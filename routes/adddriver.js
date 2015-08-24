var express = require('express');
var router = express.Router();
var pg = require('pg');
var sys = require('sys');

//Get Adding drivers page
router.get('/', function(req, res, next) {
	res.render('adddriver');
});


module.exports = router;