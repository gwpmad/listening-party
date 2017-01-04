const bodyParser = require('body-parser');
const detectSuspiciousLogins = require('../middleware/detectSuspiciousLogins');

/*
  The string username[$gt]= is a special syntax used by the qs module
  (default in ExpressJS and the body-parser middleware). So I need to used
  extended: true to make it use qs in order to do my suspicious login test
  See TAKING NODEJS AND MONGODB EXPLOITATION FURTHER at
  blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html
*/
const urlencodedParser = bodyParser.urlencoded({ extended: true });

const ifAuthenticatedThenProgress = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
};

const ifAuthenticatedDoNotProgress = (req, res, next) => {
  if (!req.isAuthenticated()) return next();
  res.redirect('/');
};

module.exports = (app, passport, suspiciousLoginsEmitter) => {
  app.get('/', ifAuthenticatedThenProgress, (req, res) => res.render('dashboard', { user: req.user }));

  app.get('/login', ifAuthenticatedDoNotProgress, (req, res) => res.render('login', { message: req.flash('error').shift() }));

  app.post('/login',
      urlencodedParser,
      detectSuspiciousLogins(suspiciousLoginsEmitter),
      passport.authenticate('login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true,
      })
  );

  app.get('/signup', ifAuthenticatedDoNotProgress, (req, res) => res.render('signup', { message: req.flash('error').shift() }));

  app.post('/signup',
      urlencodedParser,
      passport.authenticate('signup', {
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash: true,
      })
    );

  app.get('/logout', ifAuthenticatedThenProgress, (req, res) => {
    req.logout();
    res.redirect('/login');
  });
};
