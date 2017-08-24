var express = require('express');
var router = express.Router();

var users =
  [
    {
      name: "Curtis Stochl",
      address: "115 Hayes St SW Cedar Rapids IA, 52404",
      id: 0
    },
    {
      name: "Gus Stochl",
      address: "Dogtown",
      id: 1
    }
  ];

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users.handlebars', {users: users});
});
router.get('/:id', function(req, res, next) {
  var user = users[req.params.id];
  res.render('user.handlebars', {user: user});
});


module.exports = router;
