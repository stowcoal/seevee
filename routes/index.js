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
  if (!req.session.user)
    return res.redirect(303, '/signin');
  res.render('account.handlebars', {});
});

router.post('/account', function(req, res, next) {
  var user = req.session.user;
  userController.edit(user._id, req.body, function(err, data){
    req.session.user = data;
    res.redirect(303, '/account');
  });
});

router.post('/account/profile', function(req, res, next) {
  var user = req.session.user;
  console.log(req.body);
  userController.editProfile(user._id, req.body, function(err, data){
    req.session.user = data;
    res.redirect(303, '/account');
  });
});

router.post('/account/delete', function(req, res, next) {
  var user = req.session.user;
  userController.delete(user._id, function(err){
    delete req.session.user;
    res.redirect(303, '/');
  });
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
      return res.redirect(303, '/signin?err=' + err);
    }
    req.session.user = data;
    return res.redirect(303, '/account');
  });
});

router.get('/signout', function(req, res, next) {
  delete req.session.user;
  res.redirect(303, '/signin');
});

module.exports = router;
