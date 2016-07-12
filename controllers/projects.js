//REQUIREMENTS
var express = require('express');
var router = express.Router();
var Sequelize = require("sequelize");
var db = process.env.DATABASE_URI || "postgres://localhost/social_app_dev";
var connection = new Sequelize(db);
// var User = require('../models/users.js').model;
var User = require('../models/users.js');
var Project = require('../models/projects.js');
var passport = require('../config/passport.js');

// ------------------------------
// ROUTES THAT DON'T REQUIRE AUTH
// ------------------------------

//INDEX
router.get("/", function(req, res) {
  Project.findAll().then(function(projects, err) {
    if (err) {
      console.log(err);
    } else {
      console.log(projects);
      res.send(projects);
    }
  });
})

// -----------------------------------------------
// ROUTES THAT REQUIRE AUTHENTICATION w/ JWT BELOW
// -----------------------------------------------
router.use(passport.authenticate('jwt', { session: false }));

//SHOW
router.get("/:project_id", function(req, res) {
  Project.findById(req.params.project_id, {include: [User]}).then(function(project, err) {
    if (err) {
      console.log(err);
    } else {
      console.log(project);
      res.send(project);
    }
  })
})

module.exports = router;