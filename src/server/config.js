const Strategy = require('passport-local').Strategy;
const bCrypt = require('bCrypt');

module.exports = (passport, db) => {
    const User = db.collection('users');
    const isValidPassword = (user, password) => bCrypt.compareSync(password, user.password);

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });
 
    passport.deserializeUser(function(id, done) {
        User.findOne({_id: id }, function(err, user) {
            if (err) throw err;
            done(err, user);
        });
    });

    passport.use('login', new Strategy((username, password, done) => {
        User.findOne({ 'username': username }, (err, user) => {
            if (err) return done(err);
            if (!user) return done(null, false, { message: 'User not found' });
            if (!isValidPassword(user, password))
                return done(null, false, { message: 'Incorrect username or password' });

            return done(null, user);
        });
    }));
}