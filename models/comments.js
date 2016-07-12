var express = require('express');
var Sequelize = require("sequelize");
var db = process.env.DATABASE_URI || "postgres://localhost/social_app_dev";
var connection = new Sequelize(db);
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
//Related Models
// var User = require('./users.js').model;
var User = require('./users.js');
var Project = require('./projects.js');

// console.log("in users")
var Comment = connection.define('comments', {
  content: {
    type: Sequelize.TEXT,
    allowNull: false 
  }
// }, {
//   classMethods: {
//     associate: function(models) {
//       Comment.belongsTo(User);
//       Comment.belongsTo(Project);
//     }
//   }
});

//Relationships
Comment.belongsTo(User);
Comment.belongsTo(Project);

connection.sync().then(function () {
  // Table created
  console.log("now we have a comment table");
});

module.exports = Comment;