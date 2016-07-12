var express = require('express');
var Sequelize = require("sequelize");
var db = process.env.DATABASE_URI || "postgres://localhost/social_app_dev";
var connection = new Sequelize(db);
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
//Related Models
var Project = require('./projects.js');
// var Comment = require('./comments.js');

// console.log("in users")
var User = connection.define('users', {
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false 
  },
  email: {
    type: Sequelize.STRING, 
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING
  }
}, 
// this is how I can hash passwords using sequelize and add instance methods
{
  hooks: {
    afterValidate: function(user) {
      user.password = bcrypt.hashSync(user.password, 10);
    }
  },
  instanceMethods: {
    authenticate: function(passwordTry) {
      return bcrypt.compareSync(passwordTry, this.password);
    }
  },
  // classMethods: {
  //   associate: function(models) {
  //     User.hasMany(models.Project);
  //     User.hasMany(models.Comment);
  //   }
  // }
});

// var Project = connection.define('projects', {
//   title: {
//     type: Sequelize.STRING,
//     allowNull: false 
//   },
//   image: {
//     type: Sequelize.TEXT, 
//     allowNull: true
//   },
//   description: {
//     type: Sequelize.TEXT,
//     allowNull: false
//   }
// // }, {
// //   classMethods: {
// //     associate: function(models) {
// //       Project.belongsTo(User);
// //       Project.hasMany(Comment);
// //     }
// //   }
// });

//Relationships
User.hasMany(Project);
Project.belongsTo(User);
// User.hasMany(Comment);

connection.sync().then(function () {
  // Table created
  console.log("now we have a user table");
});

module.exports = User;

