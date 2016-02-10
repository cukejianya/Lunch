var LocalStrategy = require('passport-local').Strategy;

var User = require('../app/models/user');

var pass = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    // allows us to pass back the entire request to the callback
    passReqToCallback : true
    },
  function(req, email, password, done) {
    // User.findone wont fire unless data is sent back
    process.nextTick(function() {
      User.findOne({ 'local.email' : email}, function(err, user) {
        if (err) return done(err);
        // check if email is taken
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {
          //create new user
          var newUser = new User();

          // set the user's local credentials
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);
          newUser.local.fullname.first = req.body.first
          newUser.local.fullname.last = req.body.last
          newUser.local.phone = req.body.phone

          // save the user
          newUser.save(function(err) {
            if (err) throw err;

            return done(null, newUser)
          });
        }
      });
    });
}));

passport.use('local-login', new LocalStrategy({
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true
},
function(req, email, password, done) {

  User.findOne({'local.email' : email}, function(err, user) {
    if (err) return done(err);

    if (!user) return done(null, false, req.flash('loginMessage', 'No user found.'));

    if (!user.validPassword(password))
      return done(null,false, req.flash('loginMessage', 'Oops! Wrong password.'));

    return done(null, user);
  });
}));
}




module.exports = pass;
