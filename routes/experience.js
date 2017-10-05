var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var userController = require('../controllers/user');
var moment = require('moment');
var DateOnly = require('mongoose-dateonly');


router.get('/', function(req, res, next) {
  if (!req.session.user)
    return res.redirect(303, '/signin');

  res.render('experiences.hbs', {});
});

router.get('/:id', function(req, res, next) {
  if (!req.session.user)
    return res.redirect(303, '/signin');
  var experience = req.session.user.experiences.find(function(e){
    return e._id == req.params.id;
  });

  //experience.start = moment(experience.start, 'YYYYMMDD').format('YYYY-MM-DD');
  //experience.end = moment(experience.end, 'YYYYMMDD').format('YYYY-MM-DD');
  res.render('experience.hbs', {
      'experience': experience,
      active: 'experience'
    });
});

router.post('/', function(req, res, next) {
  var user = req.session.user;
  userController.upsertExperience(user._id, req.body, function(err, data){
    if (data)
      req.session.user = data;
    res.redirect(303, req.headers.referer);
  });
});

router.post('/:id/delete', function(req, res, next) {
  var user = req.session.user;
  userController.deleteExperience(user._id, req.params.id, function(err, data){
    if (data)
      req.session.user = data;
    res.redirect(303, '/experience');
  });
});

router.post('/:experienceId/detail', function(req, res, next) {
  var user = req.session.user;
  var detail = req.body;
  userController.upsertExperienceDetail(user._id, req.params.experienceId, detail, function(err, data){
    if (data)
      req.session.user = data;
    res.redirect(303, req.headers.referer);
  });
});

router.post('/:experienceId/detail/:detailId/delete', function(req, res, next) {
  var user = req.session.user;
  userController.deleteExperienceDetail(user._id, req.params.experienceId, req.params.detailId, function(err, data){
    if (data)
      req.session.user = data;
    res.redirect(303, req.headers.referer);
  });
});

module.exports = router;
