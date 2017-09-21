var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  userController.getAll(function(err, data){
    var users = data;
    res.render('users.handlebars', {users: users});
  });
});
router.get('/:id', function(req, res, next) {
  userController.get(req.params.id, function(err, data){
    var user = data;
    res.render('user.handlebars', {user: user});
  });
});


module.exports = router;
