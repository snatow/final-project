var express = require('express');
var Sequelize = require("sequelize");
var db = process.env.DATABASE_URI || "postgres://localhost/social_app_dev";
var connection = new Sequelize(db);
var bcrypt = require('bcryptjs');
var crypto = require('crypto');

var Comment = connection.define('comments', {
  content: {
    type: Sequelize.TEXT,
    allowNull: false 
  }
});

var table = function() {
    Comment.sync().then(function () {
    // Table created
    console.log("now we have a comment table");
  })
};

module.exports = {
  model: Comment,
  table: table
}
