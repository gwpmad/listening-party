const Strategy = require('passport-local').Strategy;
const bCrypt = require('bCrypt');

module.exports = (passport, db) => {
    const User = db.collection('users');
    const isValidPassword = (user, password) => bCrypt.compareSync(password, user.password);
    const createHash = (password) => bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);

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

    passport.use('signup', new Strategy({ passReqToCallback : true }, (username, password, done) => {
        function findOrCreateUser() {
            User.findOne({ 'username': username }, (err, user) => {
                if (err) {
                    console.log('Error in signup' + err);
                    return done(err);
                }
                if (user) {
                    console.log('User already exists');
                    return done(null, false, { message: 'User already exists' });
                } else {
                    const newUser = User.insertOne({
                        username,
                        password: createHash(password),
                        email: req.body.email, // from http://stackoverflow.com/questions/15568851/node-js-how-to-send-data-from-html-to-express
                    }, (err) => {
                        if (err) {
                            console.log('Error saving user:', err);
                            throw err;
                        }
                        console.log('User registration successful');
                        return done(null, User.findOne({_id: newUser.insertedId }));
                    });
                }
            })
        }
    }));
}