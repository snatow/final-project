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
    // User.findOne({username: jwt_payload._doc.username}, function(err, user) {
      client.query("SELECT * FROM users WHERE username=$1", [jwt_payload._doc.username], function(err, result) {
        if (err) {
            return done(err, false);
        }

        if (result) {
            console.log("user is " + result.username)
            done(null, user);
        } else {
            done(null, false);
            // or you could create a new account
        }
    });
}));

passport.use( new LocalStrategy (
  function( username, password, done ) {
    client.query("SELECT * FROM users WHERE username=$1", [username], function( err, dbUser ) {
      if (err) { return done(err); }
      if (!dbUser) {
        // If we want to send back flash messages with a description of the error
        // We would need to install express-flash for this to work

        // return done(null, false, { message: 'Incorrect username.' });
        return done(null, false);
      }
      //THIS IS NOT WORKING - BUT I THINK I SHOULD HAVE IT AT SOME POINT
      // if (!dbUser.authenticate(password)) {
        // return done(null, false, { message: 'Incorrect password.' });
        // return done(null, false);
      // }
      console.log("DBUSER");
      console.log(dbUser.rows[0].username);
      return done(null, dbUser.rows[0]);
    });
  }));

module.exports = passport;