var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var ejsHelper = require('ejs-helper');
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var path = require('path');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js')

var static = function(dir) {
  return express.static(path.join(__dirname, dir));
}

mongoose.connect(configDB.url);

require('./config/passport')(passport);

app.set('view engine', 'ejs');

app.use('/views/css', static('views/bower_components/flat-ui/dist/css'));
app.use('/views/css', static('views/css'));
app.use('/views/js', static('views/bower_components/flat-ui/dist/js'));
app.use('/views/img', static('views/bower_components/flat-ui/dist/img'));
app.use('/views/fonts', static('views/bower_components/flat-ui/dist/fonts'));

app.use(ejsHelper({
    cssPath: 'views/css/',
    jsPath: 'views/js/',
}));
app.use(morgan('dev')); //log every request to the console
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// require for passport
app.use(session({
  secret: 'ilovescotchscotchyscotchscotch',
  resave: true,
  saveUninitialized: true,
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes.js')(app, passport);
app.listen(port);
console.log('The magic happens on port ' + port);
