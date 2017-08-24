var expect = require('chai').expect;
var request = require('supertest');
var app = require('../app.js');

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
      .send({email: 'testemail@test.com', password: 'test'})
      .expect(303, done);
  });
});

describe('/signup', function(done){
  it('should return 303 and set session', function(done){
    request(app)
      .post('/signup')
      .send({email: 'testemail@test.com', password: 'test'})
      .expect(303, done);
  });
});

describe('/signin', function(done){
  it('should return 303 and set session', function(done){
    request(app)
      .post('/signin')
      .send({email: 'testemail@test.com', password: 'test'})
      .expect(303, done);
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
