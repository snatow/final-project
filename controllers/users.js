var express = require('express');
var router = express.Router();
var User = require('../models/users.js');
var passport = require('../config/passport.js');

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
	User.create(req.body, function(err, user) {
		if(err) {
			console.log(err); 
			res.status(500).end();
		}
		res.send(true);
	});
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