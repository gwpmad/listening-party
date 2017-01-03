const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const ifAuthenticatedThenProgress = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
};

const ifAuthenticatedDoNotProgress = (req, res, next) => {
    if (!req.isAuthenticated()) return next();
    res.redirect('/');
};

module.exports = (app, passport) => {
    app.get('/', ifAuthenticatedThenProgress, (req, res) => res.render('dashboard', { user: req.user }));

    app.get('/login', ifAuthenticatedDoNotProgress,(req, res) => res.render('login'));

    app.post('/login', urlencodedParser,
        passport.authenticate('login',{
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        })
    );

    app.get('/signup', ifAuthenticatedDoNotProgress, (req, res) => res.render('signup'));

    app.post('/signup',
        urlencodedParser,
        passport.authenticate('signup', {
            successRedirect: '/',
            failureRedirect: '/signup',
            failureFlash: true
        })
    );

    app.get('/logout', ifAuthenticatedThenProgress, (req, res) => {
        req.logout();
        res.redirect('/login');
    })
};