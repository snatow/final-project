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


// Project.table.then(function() {
//     connection.sync().then(function () {
//     // Table created
//     console.log("now we have a user table");
//   })
// })

connection.sync().then(Project.table).then(Comment.table);
// connection.sync().then(Project.table).then(function() {
//   console.log("did this work?");
// })
// connection.sync().then(Project.table.then(function() {
//   console.log("we made it!")
// }));
// connection.sync().success()
// User.sync().then(Project.model.sync).then(Comment.model.sync);

module.exports = User;

// var table = function() {
//   connection.sync().then(function () {
//     // Table created
//     console.log("now we have a user table");
//   })
// }

// module.exports = {
//   model: User,
//   table: function() {
//     connection.sync().then(function() {
//       console.log("now we have a user table");
//     })
//   }
// };
// exports.table = table;
// exports.model = User;

