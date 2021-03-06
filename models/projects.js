var express = require('express');
var Sequelize = require("sequelize");
var db = process.env.DATABASE_URI || "postgres://localhost/social_app_dev";
var connection = new Sequelize(db);
var bcrypt = require('bcryptjs');
var crypto = require('crypto');

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

var table = function() {
    Project.sync().then(function() {
    //Table created
    console.log("now we have a project table");
    // return promise;
  })
}

module.exports = {
  model: Project,
  table: table
};
