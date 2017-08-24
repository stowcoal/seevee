var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../models/user');

var options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeader();
options.secretOrKey = process.env.JWT_SECRET;

passport.use(new JwtStrategy(options,  function(jwt_payload, done) {
		User.findOne({id: jwt_payload.sub}, function(err,user) {
			if (err) {
        return done(err, false);
      }
      if (user) {
        done (null, user);
      } else {
        done (null, false);
      }
		});
  })
);
