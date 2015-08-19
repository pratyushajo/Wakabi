var express = require('express');
var router = express.Router();
var pg = require('pg');
var sys = require('sys');

//Get Login page
router.get('/', function(req, res, next) {
	res.render('payment');
});


module.exports = router;