var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');

router.get('/', function(req, res, next) {
  if (!req.session.user)
    return res.redirect(303, '/signin');
  res.render('security.hbs', {});
});

// TODO change password and change username?

module.exports = router;
