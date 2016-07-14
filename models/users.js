var express = require('express');
var Sequelize = require("sequelize");
var db = process.env.DATABASE_URI || "postgres://localhost/social_app_dev";
var connection = new Sequelize(db);
var bcrypt = require('bcryptjs');
var crypto = require('crypto');

//Related Models
var Project = require('./projects.js');
var Comment = require('./comments.js');

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
}, // this is how I can hash passwords using sequelize and add instance methods
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
  }
});

//Relationships
User.hasMany(Project.model);
Project.model.belongsTo(User);
User.hasMany(Comment.model);
Comment.model.belongsTo(User);
Project.model.hasMany(Comment.model);
Comment.model.belongsTo(Project.model);

User.sync().then(function() {
  Project.model.sync().then(function() {
    Comment.model.sync()
  })
})


module.exports = User;
