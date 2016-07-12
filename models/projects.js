var express = require('express');
var Sequelize = require("sequelize");
var db = process.env.DATABASE_URI || "postgres://localhost/social_app_dev";
var connection = new Sequelize(db);
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
//Related Models
// var userTable = require('./users.js');
// console.log("this is usertable")
// console.log(userTable);
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
  }, 
  github: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  url: {
    type: Sequelize.TEXT,
    allowNull: true
  }
});

//Relationships - pretty sure I don't need this here
// Project.belongsTo(User);
// User.hasMany(Project);
// Project.hasMany(Comment);

// //Create Table
// userTable.table().then(function() {
//   connection.sync().then(function () {
//     // Table created
//     console.log("now we have a project table");
//   });
// });

var table = connection.sync().then(function() {
  //Table created
  console.log("now we have a project table");
})

module.exports = {
  model: Project,
  table: table
};
