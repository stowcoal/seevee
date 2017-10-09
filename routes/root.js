var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var userController = require('../controllers/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.hbs', {
    pageTestScript: '/test/tests-home.js'
  });
});

router.get('/jade', function(req, res, next) {
  res.render('index.jade', { title: 'Express' });
});

router.get('/about', function(req, res, next) {
  res.render('about.hbs', {});
});

router.get('/signup', function(req, res, next) {
  res.render('signup.hbs', {});
});

router.get('/signin', function(req, res, next) {
  res.render('signin.hbs', {});
});

router.post('/signup', function(req, res, next) {
  var user = new User(req.body);
  userController.reg(user, function(err, data){
    if (err){
      if (err.name === 'MongoError' && err.code === 11000)
        err = "Username already taken.";
      else if (err.name === 'ValidationError')
        err = "Please fill in all fields.";
      else
        err = "An error occurred during registration.";
      return res.redirect(303, '/signup?err=' + err);
    }
    req.session.user = data;
    return res.redirect(303, '/profile');
  });
});

router.post('/signin', function(req, res, next) {
  var user = new User(req.body);
  userController.auth(user, function(err, data){
    if (err){
      return res.redirect(303, '/signin?err=' + 'An error occurred');
    }
    if (!data){
      return res.redirect(303, '/signin?err=' + 'Invalid credentials');
    }
    req.session.user = data;
    return res.redirect(303, '/profile');
  });
});

router.get('/signout', function(req, res, next) {
  delete req.session.user;
  res.redirect(303, '/signin');
});

module.exports = router;
