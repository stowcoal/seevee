var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');

router.get('/', function(req, res, next) {
  if (!req.session.user)
    return res.redirect(303, '/signin');
  var skills = req.session.user.skills.find(function(e){
    return e._id == req.params.id;
  });
  res.render('skills.hbs', {
    skills: skills
  });
});

router.post('/', function(req, res, next) {
  var user = req.session.user;

  userController.upsertSkill(user._id, req.body, function(err, data){
    if(data)
      req.session.user = data;
    res.redirect(303, req.headers.referer);
  });
});

router.post('/update', function(req, res, next) {
  var user = req.session.user;
  userController.updateSkills(user._id, req.body.skills, function(err, data){
    if(data)
      req.session.user = data;
    res.redirect(303, req.headers.referer);
  });
});

router.post('/:id/delete', function(req, res, next) {
  var user = req.session.user;
  userController.deleteSkill(user._id, req.params.id, function(err, data){
    if(data)
      req.session.user = data;
    res.redirect(303, '/skills');
  });
});

module.exports = router;
