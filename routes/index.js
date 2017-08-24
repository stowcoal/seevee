var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var userController = require('../controllers/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.handlebars', {
    pageTestScript: '/test/tests-home.js'
  });
});
router.get('/jade', function(req, res, next) {
  res.render('index.jade', { title: 'Express' });
});
router.get('/about', function(req, res, next) {
  res.render('about.handlebars', {});
});
router.get('/signup', function(req, res, next) {
  res.render('signup.handlebars', {});
});
router.get('/account', function(req, res, next) {
  res.render('account.handlebars', {});
});
router.get('/signin', function(req, res, next) {
  res.render('signin.handlebars', {});
});
router.post('/signup', function(req, res, next) {
  var user = new User(req.body);
  userController.reg(user, function(err, data){
    if (err){
      return res.redirect(303, '/signup');
    }
    req.session.user = data;
    return res.redirect(303, '/account');
  });
});
router.post('/signin', function(req, res, next) {
  var user = new User(req.body);
  userController.auth(user, function(err, data){
    if (err){
      return res.redirect(303, '/signin');
    }
    req.session.user = data;
    return res.redirect(303, '/account');
  });
});

module.exports = router;
