//REQUIREMENTS
var express = require('express');
var router = express.Router();
var Sequelize = require("sequelize");
var db = process.env.DATABASE_URI || "postgres://localhost/social_app_dev";
var connection = new Sequelize(db);
var User = require('../models/users.js');
var passport = require('../config/passport.js');
var Project = require('../models/projects.js').model;
var Comment = require('../models/comments.js').model;

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
});

// USER SHOW - user profile
router.get("/:user_id", function(req, res) {
	User.findById(req.params.user_id).then(function(user, err) {
		if (err) {
			console.log(err);
		} else {
			Project.findAll({where: {userId: user.dataValues.id}}).then(function(projects) {
				// console.log(projects.length);
				var userProjects = [];
				for (var i = 0; i < projects.length; i++) {
					userProjects.push(projects[i].dataValues);
				}
				// console.log(userProjects);
				var userInfo = {}
				userInfo["profile"] = user.dataValues;
				userInfo["projects"] = userProjects;
				// console.log(userInfo);
				res.send(userInfo);
			})
		}
	})
})

// EDIT PROJECT FOR USER
router.get("/:user_id/projects/:project_id/edit", function(req, res) {
	Project.findById(req.params.project_id).then(function(project, err) {
		// console.log(project.dataValues.userId);
		// console.log(req.params.user_id);
		if (err) {
			console.log(err);
		} else if (project.dataValues.userId == req.params.user_id) {
			res.send(project);
		} else {
			console.log("you do not have the correct permissions");
			res.send("you cannot do this");
		}
	})
})

//UPDATE USER PROFILE
router.put("/:user_id", function(req, res) {
	console.log("username");
	console.log(req.body.username);
	User.findById(req.params.user_id).then(function(user) {
		user.update({
			username: req.body.username,
			email: req.body.email
		}). then(function(user) {
			Project.findAll({where: {userId: user.id}}).then(function(projects) {
				// console.log(projects.length);
				var userProjects = [];
				for (var i = 0; i < projects.length; i++) {
					userProjects.push(projects[i].dataValues);
				}
				// console.log(userProjects);
				var userInfo = {}
				userInfo["profile"] = user.dataValues;
				userInfo["projects"] = userProjects;
				// console.log(userInfo);
				res.send(userInfo);
			})
		})
	})
})

// UPDATE PROJECT FOR USER
router.put("/project/:project_id", function(req, res) {
	Project.findById(req.params.project_id).then(function(project, err) {
		if (err) {
			console.log(err);
		} else {
			project.update({
				title: req.body.title,
				image: req.body.image,
				description: req.body.description, 
				github: req.body.github,
				url: req.body.url
			}).then(function(project) {
				res.send(project);
			})
		}
	})
})

// CREATE PROJECT FOR USER
router.post("/:user_id/new-project", function(req, res) {
	var newProject = Project.create({
		title: req.body.title,
		image: req.body.image,
		description: req.body.description, 
		github: req.body.github,
		url: req.body.url,
		userId: req.params.user_id
	}).then(function(project) {
		res.send(project);
	})
	// res.send(newProject);
})

// CREATE A COMMENT ON A PROJECT FOR USER
router.post("/:user_id/project/:project_id/comment", function(req, res) {
	Comment.create({
		content: req.body.content,
		userId: req.params.user_id,
		projectId: req.params.project_id
	}).then(function(comment) {
		Project.findById(comment.projectId, {include: [User, Comment]}).then(function(project) {
			res.send(project);
		})
	})
})

// DELETE PROJECT FOR USER
router.delete("/:user_id/projects/:project_id/delete", function(req, res) {
	Project.findById(req.params.project_id).then(function(project, err) {
		console.log("=======================");
		console.log(project);
		if (err) {
			console.log(err);
		} else if (project.dataValues.userId == req.params.user_id) {
			project.destroy();
			res.send(true);
		} else {
			console.log("you do not have the correct permissions");
		}
	})
})


module.exports = router;
