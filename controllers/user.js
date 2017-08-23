var express = require('express');
var User = require('../models/user.js');

var api = {};

api.addUser = function(req, res) {
  var user = new User(req.body.user);

  user.save(function(err){
    if(err) res.status(500);
    res.status(200).json({ token: 1 });
  });
};

module.exports = api;
