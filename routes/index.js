var express = require('express');
var router = express.Router();

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
router.get('/signin', function(req, res, next) {
  res.render('signin.handlebars', {});
});

module.exports = router;
