var routes = function(app, passport) {
  app.get('/', function(req, res) {
    res.render('index.ejs', {message: req.flash('loginMessage') });
  });

  app.get('/login', function(req,res) {
    res.render('login.ejs', {message: req.flash('loginMessage') });
  });

  //*process login stuff HERE
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile',
    failureRedirect : '/signup',
    failureFlash : true
  }));

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile',
    failureRedirect : '/',
    failureFlash : true
  }))

  app.get('/signup', function(req, res) {
    res.render('signup.ejs', {message: req.flash('signupMessage') });
  });

  app.get('/profile', isLoggedIn, function(req,res) {
    res.render('profile.ejs', {
      user : req.user
    })
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

    res.redirect('/');
}

module.exports = routes;
