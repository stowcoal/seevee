var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');

router.get('/', function(req, res, next) {
  if (!req.session.user)
    return res.redirect(303, '/signin');
  res.render('resumes.hbs', {});
});

router.post('/', function(req, res, next) {
  var user = req.session.user;
  userController.upsertResume(user._id, req.body, function(err, data){
    if(data)
      req.session.user = data;
    res.redirect(303, req.headers.referer);
  });
});

router.get('/:id', function(req, res, next) {
  if (!req.session.user)
    return res.redirect(303, '/signin');

  var resume = req.session.user.resumes.find(function(e){
    return e._id == req.params.id;
  });

  res.render('resume.hbs', {
    resume: resume
  });
});

router.post('/:id/delete', function(req, res, next) {
  var user = req.session.user;
  userController.deleteResume(user._id, req.params.id, function(err, data){
    if(data)
      req.session.user = data;
    res.redirect(303, '/resumes');
  });
});

module.exports = router;
