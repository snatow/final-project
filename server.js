//=========================
// REQUIREMENTS
//=========================

//Express
var express = require('express');
var app = express();

//Morgan
var morgan = require('morgan');

//Body-Parser
var bodyParser = require('body-parser');

//Method Override
var methodOverride = require('method-override');

//Cookie Parser
var cookieParser = require('cookie-parser');

//Port
var port = process.env.PORT || 3000;

//Database
var db = process.env.DATABASE_URI || "postgres://localhost/social_app_dev";
var Sequelize = require("sequelize");

//PG
var pg = require('pg');

//=========================
// MIDDLEWARE
//=========================

//Public Files
app.use(express.static('public'));

//Logger
app.use(morgan('dev'));

//Body-Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Method Override
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

//Cookie Parser
app.use(cookieParser());



//=========================
// DATABASE
//=========================

//Postgress
var client = new pg.Client(db);
client.connect();

//Sequelize
var sequelize = new Sequelize(db);
sequelize.authenticate().then(function(err) {
  if (err) {
    console.log("Unable to connect to the database: " + err);
  } else {
    console.log("connection to db successful");
  }
})


//=========================
// CONTROLLERS
//=========================
// var testController = require('./controllers/test.js');
// app.use('/test', testController);

var usersController = require('./controllers/users.js');
app.use('/users', usersController);

var authController = require('./controllers/auth.js')
app.use('/auth', authController);

var projectsController = require('./controllers/projects.js');
app.use('/projects', projectsController);

// var commentsController = require('./controllers/comments.js');
// app.use('/comments', commentsController);



//=========================
// LISTEN
//=========================
app.listen(port);
console.log('=============================');
console.log('Server running off PORT: ' + port);
console.log('=============================');
