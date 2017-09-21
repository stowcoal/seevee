var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    profile: {
      first_name: {
        type: String
      },
      last_name: {
        type: String
      },
      street: {
        type: String
      },
      city: {
        type: String
      },
      state: {
        type: String
      },
      zip: {
        type: String
      },
      phone: {
        type: String
      },
      email: {
        type: String
      }
    },
    employers: [
      {
        name : {
          type: String,
          required: true
        },
        details: [
          {
            name: {
              type: String
            },
            description: {
              type: String
            },
            tags: [
              {
                type: String
              }
            ]
          }
        ],
      }
    ]
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
