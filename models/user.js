var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }
  }
);

userSchema.pre('save', function (next) {
	var user = this;
	if (this.isModified('password') || this.isNew) {
		bcrypt.hash(user.password, 10, function(err, hash) {
			if (err) {
				return next(err);
			}
			user.password = hash;
			next();
		});
	}
	else {
		return next();
	}
});

userSchema.methods.verifyPassword = function(password, cb) {
   var user = this;
	 bcrypt.compare(password, user.password, function (err, isMatch) {
		 if (err) {
			 return cb(err);
		 }
		 cb(null, isMatch);
	 });
};

var User = mongoose.model('User', userSchema);
module.exports = User;
