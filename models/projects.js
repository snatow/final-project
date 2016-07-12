var express = require('express');
var Sequelize = require("sequelize");
var db = process.env.DATABASE_URI || "postgres://localhost/social_app_dev";
var connection = new Sequelize(db);
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
//Related Models
// var User = require('./users.js');
// var Comment = require('./comments.js');

// console.log("in users")
var Project = connection.define('projects', {
  title: {
    type: Sequelize.STRING,
    allowNull: false 
  },
  image: {
    type: Sequelize.TEXT, 
    allowNull: true
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  }
// }, {
//   classMethods: {
//     associate: function(models) {
//       Project.belongsTo(User);
//       Project.hasMany(Comment);
//     }
//   }
});

//Relationships
// Project.belongsTo(User);
// User.hasMany(Project);
// Project.hasMany(Comment);

//Create Table
connection.sync().then(function () {
  // Table created
  console.log("now we have a project table");
});

module.exports = Project;