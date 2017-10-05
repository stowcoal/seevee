var mongoose = require('mongoose');
var DateOnly = require('mongoose-dateonly')(mongoose);
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
    education: [
      {
        institution: {
          type: String
        },
        degree: {
          type: String
        },
        honors: {
          type: String
        },
        graduation: {
          month: {
            type: String
          },
          year: {
            type: Number
          }
        }
      }
    ],
    experiences: [
      {
        institution : {
          type: String
        },
        role: {
          type: String
        },
        start: {
          month: {
            type: String
          },
          year: {
            type: Number
          }
        },
        end: {
          month: {
            type: String
          },
          year: {
            type: Number
          }
        },
        details: [
          {
            description: {
              type: String
            }
          }
        ],
      }
    ],
    skills: [
      {
        description: {
          type: String
        }
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
