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

// CREATE A NEW USER
router.post('/', function(req, res) {
	var data = {username: req.body.username, email: req.body.email, password: req.body.password}
	var newUser = User.create({username: data.username, email: data.email, password: data.password})
	// console.log(newUser);
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
// router.get('/test', function(req, res) {
// 	res.send('This should work only if logged in');
// });

// INDEX
router.get('/', function(req, res, next) {
	User.findAll({include: [Project]}).then(function(users, err) {
		if (err) {
			console.log(err);
		} else {
			// console.log(users);
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

//DATA VISUALIZATION - GETS INFO FOR D3 
router.get("/visualization/data", function(req, res) {
	var commentData;
	var userData;
	Comment.findAll({include: [User, Project]}).then(function(comments) {
		commentData = comments;
	}).then(function() {
		User.findAll({include: [Project, Comment]}).then(function(users) {
			userData = users;
		}).then(function() {
			var nodeArray = [];
			for (var i = 0; i < userData.length; i++) {
				var nodeObj = {"name": userData[i].username};
				nodeArray.push(nodeObj);
			}
			var linkArray = [];
			for (var j = 0; j < userData.length; j++) {
				for (var k = 0; k < userData[j].projects.length; k++) {
					for (var m = 0; m < commentData.length; m ++) {
						if (userData[j].projects[k].id == commentData[m].projectId) {
							//Heroku skipped the next ID number after the seed data
							// so I need this conditional to make sure the links work
							if (commentData[m].userId < 4) {
								var linkObj = {
									"source": (parseInt(userData[j].id) - 1),
									"target": (parseInt(commentData[m].userId) - 1)
								}
								linkArray.push(linkObj);
							} else {
								var linkObj = {
									"source": (parseInt(userData[j].id) - 1),
									"target": (parseInt(commentData[m].userId) - 2)
								}
								linkArray.push(linkObj);
							}
						}
					}
				}
			}
			var data = {
				"nodes": nodeArray,
				"links": linkArray
			}
			res.send(data);
		})
	})
})

//UPDATE USER PROFILE
router.put("/:user_id", function(req, res) {
	// console.log("username");
	// console.log(req.body.username);
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
				// console.log(project);
				// res.send(project);
				Project.findById(project.dataValues.id, {include: [User, Comment]}).then(function(project) {
					res.send(project);
				})
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
		Project.findById(project.dataValues.id, {include: [User, Comment]}).then(function(project) {
			res.send(project);
		})
	})
	// res.send(newProject);
})

// CREATE A COMMENT ON A PROJECT FOR USER
router.post("/:user_id/project/:project_id/comment", function(req, res) {
	var username = "";
	User.findById(req.params.user_id).then(function(user) {
		username = user.dataValues.username;
	}).then(function() {
			Comment.create({
			content: username + ": " + req.body.content,
			userId: req.params.user_id,
			projectId: req.params.project_id
		}).then(function(comment) {
			Project.findById(comment.projectId, {include: [User, Comment]}).then(function(project) {
				res.send(project);
			})
		})
	})
})

// DELETE PROJECT FOR USER
router.delete("/:user_id/projects/:project_id/delete", function(req, res) {
	Project.findById(req.params.project_id).then(function(project, err) {
		// console.log("=======================");
		// console.log(project);
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

// DELETE COMMENT
router.delete("/:user_id/project/:project_id/comment/:comment_id", function(req, res) {
	Comment.findById(req.params.comment_id).then(function(comment, err) {
		console.log("=======================");
		console.log("comment");
		console.log(comment);
		if (err) {
			console.log(err);
		} else if (comment.dataValues.userId == req.params.user_id) {
			comment.destroy();
			// res.send(true);
			Project.findById(req.params.project_id, {include: [User, Comment]}).then(function(project, error) {
				if (error) {
					console.log(error);
				} else {
					console.log(project);
					res.send(project);
				}
			})
		} else {
			console.log("you do not have the correct permissions");
		}
	})
})


module.exports = router;
