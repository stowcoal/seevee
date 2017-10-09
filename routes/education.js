var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');

router.get('/', function(req, res, next) {
  if (!req.session.user)
    return res.redirect(303, '/signin');
  res.render('education.hbs', {});
});

router.get('/:id', function(req, res, next) {
  if (!req.session.user)
    return res.redirect(303, '/signin');
  var education = req.session.user.education.find(function(e){
    return e._id == req.params.id;
  });
  res.render('school.hbs', {
    education: education
  });
});

router.post('/', function(req, res, next) {
  var user = req.session.user;
  userController.upsertEducation(user._id, req.body, function(err, data){
    if(data)
      req.session.user = data;
    res.redirect(303, req.headers.referer);
  });
});

router.post('/:id/delete', function(req, res, next) {
  var user = req.session.user;
  userController.deleteEducation(user._id, req.params.id, function(err, data){
    if(data)
      req.session.user = data;
    res.redirect(303, '/education');
  });
});

module.exports = router;
