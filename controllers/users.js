//REQUIREMENTS
var express = require('express');
var router = express.Router();
var Sequelize = require("sequelize");
var db = process.env.DATABASE_URI || "postgres://localhost/social_app_dev";
var connection = new Sequelize(db);
var User = require('../models/users.js');
var passport = require('../config/passport.js');
var Project = require('../models/projects.js');
// var Comment = require('../models/comments.js');

// var client = new pg.Client(db);
// client.connect();


// ------------------------------
// ROUTES THAT DON'T REQUIRE AUTH
// ------------------------------

// TESTING
// router.get('/testing', function(req, res) {
// 	console.log('hi');
// 	res.send('bye');
// })

// //INDEX - playing around with not doing a SPA
// router.get("/", function(req, res) {
// 	var user = false;
// 	res.render("index.ejs", {user: false});
// })


// CREATE A NEW USER
router.post('/', function(req, res) {
	var data = {username: req.body.username, email: req.body.email, password: req.body.password}
	// console.log("username: " + data.username);
	// pg.connect(db, function(err, client, done) {
	// 	if (err) {
	// 		done();
	// 		console.log(err);
	// 	}
	// 	client.query("INSERT INTO users(username, email, password) values($1, $2, $3)", [data.username, data.email, data.password]);
	// 	res.send(true);
	// })
	var newUser = User.create({username: data.username, email: data.email, password: data.password})
	console.log(newUser);
	res.send(true);
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
	// User.find(function(users) {
	// client.query("SELECT * FROM users", function(err, users){
	User.findAll({include: [Project]}).then(function(users, err) {
		if (err) {
			console.log(err);
		} else {
			console.log(users);
			res.send(users);
		}
	});
}),

module.exports = router;
