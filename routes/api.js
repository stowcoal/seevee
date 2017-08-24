var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var userController = require('../controllers/user');
var jwt = require('jsonwebtoken');

router.post('/reg', function(req,res,next){
  var user = new User(req.body.user);
  userController.reg(user, function(err, data){
      if (err){
        res.status(500);
      }
      var token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: 10080 // in seconds
      });
      res.status(200).json({token: 'JWT ' + token});
  });
});
router.post('/auth', function(req,res,next){
  res.status(200)
    .json({});
});

module.exports = router;
