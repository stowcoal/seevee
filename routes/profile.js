var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');

router.get('/', function(req, res, next) {
  if (!req.session.user)
    return res.redirect(303, '/signin');
  res.render('profile.hbs', {});
});

router.post('/', function(req, res, next) {
  var user = req.session.user;
  userController.editProfile(user._id, req.body, function(err, data){
    if(data)
      req.session.user = data;
    res.redirect(303, req.headers.referer);
  });
});

router.post('/delete', function(req, res, next) {
  var user = req.session.user;
  userController.delete(user._id, function(err){
    delete req.session.user;
    res.redirect(303, '/');
  });
});

module.exports = router;
