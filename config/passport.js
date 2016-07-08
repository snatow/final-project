var User = require('../models/users.js');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var JwtOpts = {};
var pg = require('pg');
var db = process.env.DATABASE_URI || "postgres://localhost/social_app_dev";
var client = new pg.Client(db);
client.connect();

var util = require("util");
JwtOpts.jwtFromRequest = function(req) {
  var token = null;
  if (req && req.cookies) {
      token = req.cookies['jwt_token'];
  }
  return token;
};

JwtOpts.secretOrKey = process.env.JWT_SECRET;

// TODO: Not needed?
// JwtOpts.issuer = "accounts.examplesoft.com";
// JwtOpts.audience = "yoursite.net";

passport.use(new JwtStrategy(JwtOpts, function(jwt_payload, done) {
    console.log( "JWT PAYLOAD" + util.inspect(jwt_payload));

    // User.findOne({id: jwt_payload.sub}, function(err, user) {
    User.findOne({username: jwt_payload._doc.username}, function(err, user) {

        if (err) {
            return done(err, false);
        }

        if (user) {
            console.log("user is " + user.username)
            done(null, user);
        } else {
            done(null, false);
            // or you could create a new account
        }
    });
}));

passport.use( new LocalStrategy ( function( username, password, done ) {
    pg.connect(db, function(err, client, done) {
    if (err) {
      done();
      console.log(err);
    }
    var query = client.query("SELECT * FROM users WHERE username=jwt_payload.doc.username");
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function(result) {
      console.log(JSON.stringify(result.rows, null, "   "));
      client.end();
    });
   })
  }));

module.exports = passport;