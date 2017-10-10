var express = require('express');
require('dotenv').config();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var fs = require('fs');

var hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: 'main',
  partialsDir: [
    'views/partials/'
  ],
  helpers: {
    'lorem': require('handlebars-helper-lorem'),
    'select': require('./views/helpers/select'),
    'tablist': require('./views/helpers/tablist'),
    'ifIn': require('./views/helpers/ifIn')
  }
});

var app = express();

var db = require('./config/db');

app.use(cookieParser());
app.use(require('express-session')({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET
}));

app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});
app.use(function(req, res, next){
  res.locals.query = req.query;
  next();
});
app.use(function(req, res, next){
  res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
  next();
});

// view engine setup
app.engine('hbs', hbs.engine);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


fs.readdirSync('routes').forEach(function(file) {
  if (file.indexOf('.js') > -1) {
    var fullName = path.join('routes', file);
    app.use('/' + file.replace('root', '').replace('.js', ''), require('./' + fullName));
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
