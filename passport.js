const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// load up our user model
const User = require('./models/users');
const secret = process.env.PASSPORT_SECRET;

module.exports = function(passport) {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT');
  opts.secretOrKey = secret;
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    User.findOne({_id: jwt_payload._id}, (err, user) => {
      if (err) {
        return done(err, false);
      }
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    })
  }))
}