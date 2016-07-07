// REQUIREMENTS
var express = require('express');
var app = express();
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var port = process.env.PORT || 3000;


// MIDDLEWARE
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.use(cookieParser());



// DATABASE
var db = process.env.MONGODB_URI || "mongodb://localhost/sexy_auth_dev";
mongoose.connect(db);


// CONTROLLERS
// var testController = require('./controllers/test.js');
// app.use('/test', testController);

var usersController = require('./controllers/users.js');
app.use('/users', usersController);

var authController = require('./controllers/auth.js')
app.use('/auth', authController);



// LISTEN
app.listen(port);
console.log('=============================');
console.log('Server running off PORT: ' + port);
console.log('=============================');
