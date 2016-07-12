//REQUIREMENTS
var express = require('express');
var router = express.Router();
var Sequelize = require("sequelize");
var db = process.env.DATABASE_URI || "postgres://localhost/social_app_dev";
var connection = new Sequelize(db);
var Comment = require('../models/comments.js');
// var passport = require('../config/passport.js');


module.exports = router;