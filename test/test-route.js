var expect = require('chai').expect;
var request = require('supertest');
var agent = require('superagent').agent();
var app = require('../app.js');
var User = require('../models/user');
var Cookies;

var user = {
  password: 'testpass',
  username: 'testuser'
}

var invalidUser = {
  password: 'invalid',
  username: 'invalid'
}

describe('/', function(){
  it('should return 200', function(done) {
    request(app)
      .get('/')
      .expect(200, done);
  });
});
describe('/users', function(){
  it('should return 200', function(done) {
    request(app)
      .get('/users')
      .expect(200, done);
  });
  describe('/:userid', function(){
    it('should return 200', function(done) {
      request(app)
        .get('/users/0')
        .expect(200, done);
    });
  });
});
describe('/signup', function(){
  it('should return 200', function(done){
    request(app)
      .get('/signup')
      .expect(200, done);
  });
});
describe('/signin', function(){
  it('should return 200', function(done){
    request(app)
      .get('/signin')
      .expect(200, done);
  });
});

describe('/signup', function(done){
  it('should return 303 and return error when missing requirements', function(done){
    request(app)
      .post('/signup')
      .send({username: '', password: ''})
      .expect(303)
      .expect('Location', '/signup?err=Please%20fill%20in%20all%20fields.', done);
  });
  it('should return 303 and set session', function(done){
    request(app)
      .post('/signup')
      .send(user)
      .expect(303)
      .end(function(err, res){
        Cookies = res.headers['set-cookie'].pop().split(';')[0];
        done();
      });
  });
  it('should return 303 and return error when duplicate', function(done){
    request(app)
      .post('/signup')
      .send(user)
      .expect(303)
      .expect('Location', '/signup?err=Username%20already%20taken.', done);
  });
});

describe('/signout', function(done){
  it('should clear session', function(done){
    var req = request(app)
      .get('/signout');
    req.cookies = Cookies;
    req.expect(303)
      .expect('Location', '/signin')
      .end(function(err, res){
        Cookies = {};
        done();
      });
  });
});

describe('/signin', function(done){
  it('should return 303 and have error when invalid credentials', function(done){
    request(app)
      .post('/signin')
      .send(invalidUser)
      .expect(303)
      .expect('Location', '/signin?err=Invalid%20credentials')
      .end(done)
  });
  it('should return 303 and set session', function(done){
    request(app)
      .post('/signin')
      .send(user)
      .expect(303)
      .expect('Location', '/profile')
      .end(function(err, res){
        Cookies = res.headers['set-cookie'].pop().split(';')[0];
        done();
      });
  });
});

describe('/profile', function(done){
  it('should return 200', function(done){
    var req = request(app).get('/profile');
    req.cookies = Cookies;
    req.expect(200, done);
  });
  it('should return 303', function(done){
    var profile = {
      first_name: 'Test',
      last_name: 'Testerson',
      street: '123 Fake St',
      city: 'Faketown',
      state: 'AL',
      zip: '55555',
      phone: '555-555-5555',
      email: 'test@fake.com'
    };
    var req = request(app).post('/profile');
    req.cookies = Cookies;
    req.send(profile)
      .expect(303)
      .expect('Location', '/profile')
      .end(function(err, res){
        User.findOne({username: user.username}, function(err, data){
          user = data;
          expect(data.profile).to.deep.include(profile);
          done();
        });
      })
  });
});

describe('/experience', function(done){
  it('should return 200', function(done){
    var req = request(app).get('/experience');
    req.cookies = Cookies;
    req.expect(200, done);
  })
  it('should return 303', function(done){
    var experience = {
      institution: 'test',
      role: 'test',
      start: {
        month: 'January',
        year: 2017
      },
      end: {
        month: 'December',
        year: 2017
      }
    };
    var req = request(app).post('/experience');
    req.cookies = Cookies;
    req.send(experience)
      .expect(303)
      .end(function(err, res){
        User.findOne({username: user.username}, function(err, data){
          user = data;
          expect(data.experiences[0].toJSON()).to.deep.include(experience);
          done();
        });
      });
  });
  it('should return 303 and change the experience', function(done){
    var experience = {
      institution: 'changed',
      role: 'changed',
      start: {
        month: 'February',
        year: 2016
      },
      end: {
        month: 'March',
        year: 2016
      },
      _id: user.experiences[0]._id
    }
    var req = request(app).post('/experience');
    req.cookies = Cookies;
    req.send(experience)
      .expect(303)
      .expect('Location', '/experience/' + user.experiences[0]._id)
      .end(function(err, res){
        User.findOne({username: user.username}, function(err, data){
          user = data;
          expect(data.experiences[0].toJSON()).to.deep.include(experience);
          done();
        });
      });
  });
});

describe('/experience/:id/detail', function(done){
  it('should return 303 and return to experience and add an experience detail', function(done){
    var req = request(app).post('/experience/' + user.experiences[0]._id + '/detail');
    req.cookies = Cookies;
    req.expect(303)
      .expect('Location', '/experience/' + user.experiences[0]._id)
      .end(function(err, res){
        User.findOne({username: user.username}, function(err, data){
          user = data;
          expect(data.experiences[0].details.length).to.equal(1);
          done();
        });
      })
  });
  it('should return 303 and change the detail', function(done){
    var detail = {
      description: 'changed',
      _id: user.experiences[0].details[0]._id
    }
    var req = request(app).post('/experience/' + user.experiences[0]._id + '/detail');
    req.cookies = Cookies;
    req.send(detail)
      .expect(303)
      .expect('Location', '/experience/' + user.experiences[0]._id)
      .end(function(err, res){
        User.findOne({username: user.username}, function(err, data){
          expect(data.experiences[0].details[0].toJSON()).to.deep.include(detail);
          done();
        });
    });
  });
  it('should return 303 and change the experience', function(done){
    var experience = {
      institution: 'changed',
      role: 'changed',
      start: {
        month: 'February',
        year: 2016
      },
      end: {
        month: 'March',
        year: 2016
      },
      details: [
        {
          description: 'changedagain',
          _id: user.experiences[0].details[0]._id
        }
      ],
      _id: user.experiences[0]._id
    }
    var req = request(app).post('/experience');
    req.cookies = Cookies;
    req.send(experience)
      .expect(303)
      .expect('Location', '/experience/' + user.experiences[0]._id)
      .end(function(err, res){
        User.findOne({username: user.username}, function(err, data){
          user = data;
          expect(data.experiences[0].toJSON()).to.deep.include(experience);
          done();
        });
      });
  });
});

describe('/education', function(done){
  it('should return 200', function(done){
    var req = request(app).get('/education');
    req.cookies = Cookies;
    req.expect(200, done);
  });
  it('should return 303 and create a new education record', function(done){
    var education = {};
    var req = request(app).post('/education');
    req.cookies = Cookies;
    req.expect(303);
    req.end(function(err, res){
        User.findOne({username: user.username}, function(err, data){
          user = data;
          expect(data.education.length).to.equal(1);
          done();
        });
    });
  });
  it('should return 303 and change existing education record', function(done){
    var education = {
      _id: user.education[0]._id,
      institution: 'Test University',
      degree: 'Testology',
      honors: 'Testest',
      graduation: {
        month: 'May',
        year: 2013
      }
    };
    var req = request(app).post('/education');
    req.cookies = Cookies;
    req.send(education)
      .expect(303)
      .end(function(err, res){
        User.findOne({username: user.username}, function(err, data){
          user = data;
          expect(data.education[0].toJSON()).to.deep.include(education);
          done();
        });
    });
  });
  it('should return 200', function(done){
    var req = request(app).get('/education/' + user.education[0]._id);
    req.cookies = Cookies;
    req.expect(200, done);
  });
  it('should return 303 and delete education record', function(done){
    var req = request(app).post('/education/' + user.education[0]._id + '/delete');
    req.cookies = Cookies;
    req.expect(303)
      .expect('Location', '/education')
      .end(function(err, res) {
        User.findOne({username: user.username}, function(err, data){
          user = data;
          expect(data.education.length).to.equal(0);
          done();
        });
      });
  });
});

describe('/skills', function(done){
  it('should return 200', function(done){
    var req = request(app).get('/skills');
    req.cookies = Cookies;
    req.expect(200, done);
  });
  it('should return 303 and add a skill', function(done){
    var req = request(app).post('/skills');
    req.cookies = Cookies;
    req.send({description: 'test'})
      .expect(303)
      .end(function(err, res) {
        User.findOne({username: user.username}, function(err, data){
          user = data;
          expect(data.skills[0].description).to.equal('test');
          done();
        });
      });
  });
  it('should return 303 and update a skill', function(done){
    var req = request(app).post('/skills');
    req.cookies = Cookies;
    user.skills[0].description = 'changed';
    req.send(user.skills[0])
      .expect(303)
      .end(function(err, res) {
        User.findOne({username: user.username}, function(err, data){
          user = data;
          expect(data.skills[0].description).to.equal('changed');
          done();
        });
      });
  });
  it('should return 303 and update all skills', function(done){
    var req = request(app).post('/skills/update');
    req.cookies = Cookies;
    user.skills[0].description = 'changed again';
    req.send({skills: user.skills})
      .expect(303)
      .end(function(err, res) {
        User.findOne({username: user.username}, function(err, data){
          user = data;
          expect(data.skills[0].description).to.equal('changed again');
          done();
        });
      });
  });
  it('should return 303 delete skill', function(done){
    var req = request(app).post('/skills/' + user.skills[0]._id + '/delete');
    req.cookies = Cookies;
    req.send()
      .expect(303)
      .end(function(err, res) {
        User.findOne({username: user.username}, function(err, data){
          user = data;
          expect(data.skills.length).to.equal(0);
          done();
        });
      });
  });
});

describe('/experience/:id/delete', function(done){
  it('should return 303', function(done){
    var req = request(app).post('/experience/' + user.experiences[0]._id + '/delete');
    req.cookies = Cookies;
    req.expect(303)
       .expect('Location', '/experience')
       .end(done);
  });
});

describe('/profile/delete', function(done){
  it('should delete user logout and redirect to home', function(done){
    var req = request(app)
      .post('/profile/delete');
    req.cookies = Cookies;
    req.expect(303, done);
  });
});

describe('/api', function(){
  describe('/signup', function(done){
    it('should return 200 and a token', function(done){
      request(app)
        .post('/api/reg')
        .send({'user': {'email': 'test@test.com', 'password': 'test'} })
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.exist;
          expect(res.body).to.have.property('token');
          expect(res.body.token).to.contain('JWT ');
          done();
        });
    });
  });
});
