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

router.get('/profile', function(req, res, next) {
  if (!req.session.user)
    return res.redirect(303, '/signin');
  res.render('profile.handlebars', {'profile': 'active'});
});

router.get('/experience', function(req, res, next) {
  if (!req.session.user)
    return res.redirect(303, '/signin');

  res.render('experience.handlebars', {'experience': 'active'});
});

router.get('/security', function(req, res, next) {
  if (!req.session.user)
    return res.redirect(303, '/signin');
  res.render('security.handlebars', {'security': 'active'});
});

router.get('/employer/:id?', function(req, res, next) {
  if (!req.session.user)
    return res.redirect(303, '/signin');
  var employer = req.session.user.employers.find(function(e){
    return e._id == req.params.id;
  });
  res.render('employer.handlebars', {
      'experience': 'active',
      'employer': employer
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

router.post('/employer', function(req, res, next) {
  var user = req.session.user;
  userController.upsertEmployer(user._id, req.body, function(err, data){
    if (data)
      req.session.user = data;
    res.redirect(303, '/experience');
  });
});

router.post('/employer/:id/delete', function(req, res, next) {
  var user = req.session.user;
  userController.deleteEmployer(user._id, req.params.id, function(err, data){
    if (data)
      req.session.user = data;
    res.redirect(303, '/experience');
  });
});

router.post('/employer/:id/details/:id?', function(req, res, next) {
  var user = req.session.user;
  userController.upsertEmployerDetail(user._id, req.params.id, function(err, data){
    if (data)
      req.session.user = data;
    res.redirect(303, req.headers.referer);
  });
});

router.post('/employer/:employerId/details/:detailId/delete', function(req, res, next) {
  var user = req.session.user;
  userController.deleteEmployerDetail(user._id, req.params.employerId, req.params.detailId, function(err, data){
    if (data)
      req.session.user = data;
    res.redirect(303, req.headers.referer);
  })
})


router.post('/profile/delete', function(req, res, next) {
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
