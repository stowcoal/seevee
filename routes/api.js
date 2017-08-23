var express = require('express');
var router = express.Router();
var user = require('../controllers/user');

router.post('/reg', user.addUser);
router.post('/auth', function(req,res,next){
  res.status(200)
    .json({});
});

module.exports = router;
