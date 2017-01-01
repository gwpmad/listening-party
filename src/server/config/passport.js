const Strategy = require('passport-local').Strategy;
const bCrypt = require('bCrypt');
const ObjectId = require('../mongo').ObjectId;

module.exports = (passport, db) => {
    const User = db.collection('users');
    const isValidPassword = (user, password) => bCrypt.compareSync(password, user.password);
    const createHash = (password) => bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);

    passport.use('login', new Strategy((username, password, done) => {
        User.findOne({ 'username': username }, (err, user) => {
            if (err) return done(err);
            if (!user) return done(null, false, { message: 'User not found' });
            if (!isValidPassword(user, password))
                return done(null, false, { message: 'Incorrect username or password' });
            return done(null, user);
        });
    }));

    passport.use('signup', new Strategy({ passReqToCallback: true }, (req, username, password, done) => {
        function findOrCreateUser() {
            User.findOne({ 'username': username }, (err, user) => {
                if (err) {
                    return done(err);
                }

                if (user) {
                    return done(null, false, { message: 'User already exists' });
                } else {
                    const newUser = User.insertOne({ // v useful guide to return values: http://stackoverflow.com/questions/36792649/whats-the-difference-between-insert-insertone-and-insertmany-method
                        username,
                        password: createHash(password),
                        email: req.body.email, // from http://stackoverflow.com/questions/15568851/node-js-how-to-send-data-from-html-to-express
                    }, (err) => {
                        if (err) {
                            throw err;
                        }
                        User.findOne({ username }, (err, result) => {
                            if(err) {
                                throw err;
                            }
                            return done(null, result);
                        })
                    });
                }
            })
        }

        process.nextTick(findOrCreateUser);
    }));

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });
 
    passport.deserializeUser(function(id, done) {
        User.findOne({_id: ObjectId(id) }, function(err, user) {
            if (err) throw err;
            done(err, user);
        });
    });
}