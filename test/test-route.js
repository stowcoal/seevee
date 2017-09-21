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
      .end(function(err, res){
        Cookies = {};
        done();
      });
  });
});

describe('/signin', function(done){
  it('should return 303 and set session', function(done){
    request(app)
      .post('/signin')
      .send(user)
      .expect(303)
      .end(function(err, res){
        Cookies = res.headers['set-cookie'].pop().split(';')[0];
        done();
      });
  });
  it('should return 303 and have error when invalid credentials', function(done){
    request(app)
      .post('/signin')
      .send(invalidUser)
      .expect(303)
      .expect('Location', '/signin?err=Invalid%20credentials')
      .end(done)
  })
});

describe('/profile', function(done){
  it('should return 200', function(done){
    var req = request(app).get('/profile');
    req.cookies = Cookies;
    req.expect(200, done);
  });
  it('should return 303', function(done){
    var req = request(app).post('/profile');
    req.cookies = Cookies;
    req.send(user)
      .expect(303, done);
  });
});

describe('/employer', function(done){
  it('should return 200', function(done){
    var req = request(app).get('/employer');
    req.cookies = Cookies;
    req.expect(200, done);
  })
  it('should return 303', function(done){
    var req = request(app).post('/employer');
    req.cookies = Cookies;
    req.send({name: 'test'})
      .expect(303)
      .end(done);
  });
});

describe('/employer/:id/details/:type', function(done){
  it('should return 303', function(done){
    User.findOne({username: user.username}, function(err, data){
      user = data;
      var req = request(app).post('/employer/' + user.employers[0]._id + '/details/roles');
      req.cookies = Cookies;
      req.expect(303, done);
    });
  });
});

describe('/employer/:id/delete', function(done){
  it('should return 303', function(done){
    var req = request(app).post('/employer/' + user.employers[0]._id + '/delete');
    req.cookies = Cookies;
    req.expect(303, done);
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
