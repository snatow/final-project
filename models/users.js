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
    Comment.model.sync().then(function() {
      // User.create({ username: "user1", email: "user1", password: "user1" }).then(function() {
      //   User.create({ username: "user2", email: "user2", password: "user2" }).then(function() {
      //     User.create({ username: "user3", email: "user3", password: "user3" }).then(function() {
      //       Project.model.create({ title: "project1", 
      //     image: "http://ualr.edu/itservices/files/2006/10/projectManagement.jpg", 
      //     description: "description of project1", 
      //     github: "https://www.google.com/", 
      //     url: "https://www.google.com/", 
      //     userId: 1}).then(function() {
      //         Project.model.create({ title: "project2", 
      //       image: "http://ualr.edu/itservices/files/2006/10/projectManagement.jpg", 
      //       description: "description of project2", 
      //       github: "https://www.google.com/", 
      //       url: "https://www.google.com/", 
      //       userId: 1}).then(function() {
      //           Project.model.create({ title: "project3", 
      //         image: "http://ualr.edu/itservices/files/2006/10/projectManagement.jpg", 
      //         description: "description of project3", 
      //         github: "https://www.google.com/", 
      //         url: "https://www.google.com/", 
      //         userId: 1}).then(function() {
      //             Project.model.create({ title: "project4", 
      //           image: "http://ualr.edu/itservices/files/2006/10/projectManagement.jpg", 
      //           description: "description of project4", 
      //           github: "https://www.google.com/", 
      //           url: "https://www.google.com/", 
      //           userId: 2}).then(function() {
      //               Project.model.create({ title: "project5", 
      //             image: "http://ualr.edu/itservices/files/2006/10/projectManagement.jpg", 
      //             description: "description of project5", 
      //             github: "https://www.google.com/", 
      //             url: "https://www.google.com/", 
      //             userId: 2}).then(function() {
      //                 Project.model.create({ title: "project6", 
      //               image: "http://ualr.edu/itservices/files/2006/10/projectManagement.jpg", 
      //               description: "description of project6", 
      //               github: "https://www.google.com/", 
      //               url: "https://www.google.com/", 
      //               userId: 2}).then(function() {
      //                   Project.model.create({ title: "project7", 
      //                 image: "http://ualr.edu/itservices/files/2006/10/projectManagement.jpg", 
      //                 description: "description of project7", 
      //                 github: "https://www.google.com/", 
      //                 url: "https://www.google.com/", 
      //                 userId: 3}).then(function() {
      //                     Project.model.create({ title: "project8", 
      //                   image: "http://ualr.edu/itservices/files/2006/10/projectManagement.jpg", 
      //                   description: "description of project8", 
      //                   github: "https://www.google.com/", 
      //                   url: "https://www.google.com/", 
      //                   userId: 3}).then(function() {
      //                       Project.model.create({ title: "project9", 
      //                     image: "http://ualr.edu/itservices/files/2006/10/projectManagement.jpg", 
      //                     description: "description of project9", 
      //                     github: "https://www.google.com/", 
      //                     url: "https://www.google.com/", 
      //                     userId: 3})
      //                     })
      //                   })
      //                 })
      //               })
      //             })
      //           })
      //         })
      //       })
      //     })
      //   })
      // })
    })
  })
})


module.exports = User;
