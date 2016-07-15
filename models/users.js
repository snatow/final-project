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
      // User.create({ username: "Bob157", email: "user1", password: "user1" }).then(function() {
      //   User.create({ username: "I<3CSS", email: "user2", password: "user2" }).then(function() {
      //     User.create({ username: "Hot_Java", email: "user3", password: "user3" }).then(function() {
      //       Project.model.create({ title: "project1", 
      //     image: "http://ualr.edu/itservices/files/2006/10/projectManagement.jpg", 
      //     description: "description of project1", 
      //     github: "https://www.google.com/", 
      //     url: "https://www.google.com/", 
      //     userId: 1}).then(function() {
      //         Project.model.create({ title: "project2", 
      //       image: "http://renaissanceinstitute.eu/v1/wp-content/uploads/2015/07/yyy.jpg", 
      //       description: "description of project2", 
      //       github: "https://www.google.com/", 
      //       url: "https://www.google.com/", 
      //       userId: 1}).then(function() {
      //           Project.model.create({ title: "project3", 
      //         image: "http://zdnet4.cbsistatic.com/hub/i/r/2016/04/20/b5d1ab3b-a81b-4f38-87a0-fe5999692810/resize/770xauto/229b18fdc4347bde733a19ddb346e3a9/big-data-path.jpg", 
      //         description: "description of project3", 
      //         github: "https://www.google.com/", 
      //         url: "https://www.google.com/", 
      //         userId: 1}).then(function() {
      //             Project.model.create({ title: "project4", 
      //           image: "http://www.hec.edu/var/corporate/storage/images/knowledge/technologies-et-operations/technologies-et-systemes-d-information/reseaux-de-communication-comment-l-information-se-transmet-elle/398509-6-eng-GB/Communication-Networks-How-is-Information-Transmitted_knowledge_standard.jpg", 
      //           description: "description of project4", 
      //           github: "https://www.google.com/", 
      //           url: "https://www.google.com/", 
      //           userId: 2}).then(function() {
      //               Project.model.create({ title: "project5", 
      //             image: "http://www2.deloitte.com/content/dam/Deloitte/us/Images/promo_images/us-article-iot-information-value-loop-res-022715.JPG", 
      //             description: "description of project5", 
      //             github: "https://www.google.com/", 
      //             url: "https://www.google.com/", 
      //             userId: 2}).then(function() {
      //                 Project.model.create({ title: "project6", 
      //               image: "https://www1.aps.anl.gov/sites/default/files/user-information-button.png", 
      //               description: "description of project6", 
      //               github: "https://www.google.com/", 
      //               url: "https://www.google.com/", 
      //               userId: 2}).then(function() {
      //                   Project.model.create({ title: "project7", 
      //                 image: "http://images.fineartamerica.com/images-medium-large-5/2-cats-map-of-the-world-map-michael-tompsett.jpg", 
      //                 description: "description of project7", 
      //                 github: "https://www.google.com/", 
      //                 url: "https://www.google.com/", 
      //                 userId: 3}).then(function() {
      //                     Project.model.create({ title: "project8", 
      //                   image: "http://djdesignerlab.com/wp-content/uploads/2013/jan/krish_kash/social_media_users/social_media_users_4.jpg", 
      //                   description: "description of project8", 
      //                   github: "https://www.google.com/", 
      //                   url: "https://www.google.com/", 
      //                   userId: 3}).then(function() {
      //                       Project.model.create({ title: "project9", 
      //                     image: "http://p3cdn4static.sharpschool.com/UserFiles/Servers/Server_774010/Image/Technology/RTMT.jpg", 
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
