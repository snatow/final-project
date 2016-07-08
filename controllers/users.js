var express = require('express');
var router = express.Router();
var User = require('../models/users.js');
var passport = require('../config/passport.js');
var pg = require('pg');
// var path = require('path');
// var connectionString = require(path.join(__dirname, '../', '../', 'config'));
var db = process.env.DATABASE_URI || "postgres://localhost/social_app_dev";

var client = new pg.Client(db);
client.connect();


// ------------------------------
// ROUTES THAT DON'T REQUIRE AUTH
// ------------------------------

// TESTING
// router.get('/', function(req, res) {
// 	console.log('hi');
// 	res.send('bye');
// })


// CREATE A NEW USER
router.post('/', function(req, res) {
	var data = {username: req.body.username, email: req.body.email, password: req.body.password}
	console.log("username: " + data.username);
	pg.connect(db, function(err, client, done) {
		if (err) {
			done();
			console.log(err);
		}
		client.query("INSERT INTO users(username, email, password) values($1, $2, $3)", [data.username, data.email, data.password]);
		res.send(true);
	})
});

// -----------------------------------------------
// ROUTES THAT REQUIRE AUTHENTICATION w/ JWT BELOW
// -----------------------------------------------
router.use(passport.authenticate('jwt', { session: false }));

// TESTING
// router.get('/', function(req, res) {
// 	console.log('hi');
// 	res.send('bye');
// });
router.get('/test', function(req, res) {
	res.send('This should work only if logged in');
});

// INDEX
router.get('/', function(req, res, next) {
	User.find(function(users) {
		res.json(users);
	});
}),

module.exports = router;