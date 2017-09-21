var express = require('express');
var User = require('../models/user');

var api = {};

api.getAll = function(cb) {
  User.find({}, function(err, data){
    return cb(err, data);
  });
};
api.get = function(id, cb) {
  User.findOne({_id: id}, function(err, data){
    return cb(err, data);
  });
};
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
api.upsertExperience = function(id, experience, cb) {
  User.findOne({_id: id}, function(err, data){
    if (!data)
      return cb(err);
    if (!experience)
      return cb(err);
    if (experience._id){
      var e = data.experiences.find(function(e){
        return e._id == experience._id;
      });
      if (e._id){
        e.institution = experience.institution;
        e.role = experience.role;
      }
    }
    else {
      data.experiences.push(experience);
    }
    data.save(function(err){
      cb(err, data.toObject());
    });
  });
};
api.upsertExperienceDetail = function(userId, experienceId, detail, cb){
  User.findOne({_id: userId}, function(err, data){
    if(!data)
      return cb(err);
    var experience = data.experiences.find(function(experience){
      return experience._id == experienceId;
    });
    if (detail._id){
      var index = experience.details.findIndex(function(d){
        return d._id == detail._id;
      });
      experience.details[index] = detail;
    }
    else {
      experience.details.push({description: 'New Detail', tags: []});
    }
    data.save(function(err){
      cb(err, data.toObject());
    });
  });
};
api.deleteExperienceDetail = function(userId, experienceId, detailId, cb) {
  User.findOne({_id: userId}, function(err, data){
    if (!data)
      return cb(err);
    var experience = data.experiences.find(function(experience){
      return experience._id == experienceId;
    });
    if (experience){
      experience.details = experience.details.filter(function(detail){
        return detail._id != detailId;
      });
    }
    data.save(function(err){
      cb(err, data.toObject());
    });
  });
};
api.deleteExperience = function(id, experienceId, cb) {
  User.findOne({_id: id}, function(err, data){
    if (!data)
      return cb(err);
    data.experiences = data.experiences.filter(function(experience){
      return experience._id != experienceId;
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
