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
      var index = data.experiences.findIndex(function(e){
        return e._id == experience._id;
      });
      if (index > -1){
        data.experiences[index] = experience;
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

api.upsertEducation = function(id, education, cb) {
  User.findOne({_id: id}, function(err, data){
    if (!data)
      return cb(err);
    if (!education)
      return cb(err);
    if (education._id){
      var index = data.education.findIndex(function(e){
        return e._id == education._id;
      });
      if (index > -1){
        data.education[index] = education;
      }
    }
    else {
      data.education.push(education);
    }
    data.save(function(err){
      cb(err, data.toObject());
    });
  });
};

api.deleteEducation = function(id, educationId, cb) {
  User.findOne({_id: id}, function(err, data){
    if (!data)
      return cb(err);
    data.education = data.education.filter(function(education){
      return education._id != educationId;
    });

    data.save(function(err){
      cb(err, data.toObject());
    });
  });
};

api.updateSkills = function(id, skills, cb) {
  User.findOne({_id: id}, function(err, data){
    if (!data)
      return cb(err);
    if (!skills)
      return cb(err);

    data.skills = skills;

    data.save(function(err){
      cb(err, data.toObject());
    });
  });
};

api.upsertSkill = function(id, skill, cb) {
  User.findOne({_id: id}, function(err, data){
    if (!data)
      return cb(err);
    if (!skill)
      return cb(err);
    if (skill._id){
      var index = data.skills.findIndex(function(e){
        return e._id == skill._id;
      });
      if (index > -1){
        data.skills[index] = skill;
      }
    }
    else {
      data.skills.push(skill);
    }
    data.save(function(err){
      cb(err, data.toObject());
    });
  });
};

api.deleteSkill = function(id, skillId, cb) {
  User.findOne({_id: id}, function(err, data){
    if (!data)
      return cb(err);
    data.skills = data.skills.filter(function(skill){
      return skill._id != skillId;
    });

    data.save(function(err){
      cb(err, data.toObject());
    });
  });
};

module.exports = api;
