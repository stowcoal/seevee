var expect = require('chai').expect;
var request = require('supertest');
var agent = require('superagent').agent();
var app = require('../app.js');
var Cookies;

var user = {
  password: 'testpass',
  username: 'testuser'
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
    var baduser = user;
    baduser.username = 'invalid';
    request(app)
      .post('/signin')
      .send(baduser)
      .expect(303)
      .end(function(err, res){
        res.headers['location'].should.include('err=Invalid%20credentials');
      })
  })
});

describe('/account', function(done){
  it('should return 200', function(done){
    var req = request(app).get('/account');
    req.cookies = Cookies;
    req.expect(200, done);
  });
  it('should return 303', function(done){
    var req = request(app).post('/account');
    req.cookies = Cookies;
    req.send(user)
      .expect(303, done);
  });
});

describe('/account/delete', function(done){
  it('should delete user logout and redirect to home', function(done){
    var req = request(app)
      .post('/account/delete');
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
