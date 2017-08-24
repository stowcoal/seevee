var express = require('express');
var User = require('../models/user');

var api = {};

api.reg = function(user, cb) {
  user.save(function(err){
    cb(err, user.toObject());
  });
};
api.auth = function(user, cb) {
  User.findOne({email: user.email}, function(err, data){
    if (!data)
      return cb(err);
    data.verifyPassword(user.password, function(err, isMatch){
      if (isMatch){
        return cb(err, data);
      }
      else
        return cb(err);
    });
  });
};

module.exports = api;
