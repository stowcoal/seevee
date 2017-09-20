var express = require('express');
var User = require('../models/user');

var api = {};

api.reg = function(user, cb) {
  user.save(function(err){
    cb(err, user.toObject());
  });
};
api.auth = function(user, cb) {
  User.findOne({username: user.username}, function(err, data){
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
api.edit = function(id, user, cb) {
  User.findOne({_id: id}, function(err, data){
    if (!data)
      return cb(err);
    data.username = user.username;
    data.email = user.email;
    data.save(function(err){
      cb(err, data.toObject());
    });
  });
};
api.editProfile = function(id, profile, cb) {
  User.findOne({_id: id}, function(err, data){
    if (!data)
      return cb(err);
    data.profile = profile;
    data.save(function(err){
      cb(err, data.toObject());
    });
  });
};
api.upsertEmployer = function(id, employer, cb) {
  User.findOne({_id: id}, function(err, data){
    if (!data)
      return cb(err);
    if (!employer || !employer.name)
      return cb(err);
    if (employer._id){
      var index = data.employers.findIndex(function(e){
        return e._id == employer._id;
      });
      if (index > -1){
        data.employers[index] = employer;
      }
    }
    else {
      console.log(employer);
      data.employers.push(employer);
    }
    data.save(function(err){
      console.log(err);
      cb(err, data.toObject());
    });
  });
};
api.deleteEmployer = function(id, employerId, cb) {
  User.findOne({_id: id}, function(err, data){
    if (!data)
      return cb(err);
    data.employers = data.employers.filter(function(employer){
      return employer._id != employerId;
    });

    data.save(function(err){
      cb(err, data.toObject());
    });
  });
};
api.delete = function(id, cb) {
  User.deleteOne({_id: id}, cb);
};

module.exports = api;
