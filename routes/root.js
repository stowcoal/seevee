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

router.get('/profile', function(req, res, next) {
  if (!req.session.user)
    return res.redirect(303, '/signin');
  res.render('profile.hbs', {});
});

router.get('/security', function(req, res, next) {
  if (!req.session.user)
    return res.redirect(303, '/signin');
  res.render('security.hbs', {});
});

router.get('/education', function(req, res, next) {
  if (!req.session.user)
    return res.redirect(303, '/signin');
  res.render('education.hbs', {});
});

router.get('/education/:id', function(req, res, next) {
  if (!req.session.user)
    return res.redirect(303, '/signin');
  var education = req.session.user.education.find(function(e){
    return e._id == req.params.id;
  });
  res.render('school.hbs', {
    education: education
  });
});

router.post('/education', function(req, res, next) {
  var user = req.session.user;
  userController.upsertEducation(user._id, req.body, function(err, data){
    if(data)
      req.session.user = data;
    res.redirect(303, req.headers.referer);
  });
});

router.post('/education/:id/delete', function(req, res, next) {
  var user = req.session.user;
  userController.deleteEducation(user._id, req.params.id, function(err, data){
    if(data)
      req.session.user = data;
    res.redirect(303, '/education');
  });
});

router.get('/skills', function(req, res, next) {
  if (!req.session.user)
    return res.redirect(303, '/signin');
  var skills = req.session.user.skills.find(function(e){
    return e._id == req.params.id;
  });
  res.render('skills.hbs', {
    skills: skills
  });
});

router.post('/skills', function(req, res, next) {
  var user = req.session.user;

  userController.upsertSkill(user._id, req.body, function(err, data){
    if(data)
      req.session.user = data;
    res.redirect(303, req.headers.referer);
  });
});

router.post('/skills/update', function(req, res, next) {
  var user = req.session.user;
  userController.updateSkills(user._id, req.body.skills, function(err, data){
    if(data)
      req.session.user = data;
    res.redirect(303, req.headers.referer);
  });
});

router.post('/skills/:id/delete', function(req, res, next) {
  var user = req.session.user;
  userController.deleteSkill(user._id, req.params.id, function(err, data){
    if(data)
      req.session.user = data;
    res.redirect(303, '/skills');
  });
});

router.post('/profile', function(req, res, next) {
  var user = req.session.user;
  userController.editProfile(user._id, req.body, function(err, data){
    if(data)
      req.session.user = data;
    res.redirect(303, req.headers.referer);
  });
});

router.post('/profile/delete', function(req, res, next) {
  var user = req.session.user;
  userController.delete(user._id, function(err){
    delete req.session.user;
    res.redirect(303, '/');
  });
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
