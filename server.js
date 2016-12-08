require('dotenv').config();
const env = process.ENV || 'default';
const config = require(`./config/${env}`);

const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const viewsDir = 'src/server/views';

const passport = require('passport');
const passportConfig = require('./src/server/config/passport');
const session = require('express-session');

const MongoClient = require('mongodb').MongoClient;
const MongoStore = require('connect-mongo')(session);
const dbUrl = process.env.MONGO_URI;

const routes = require('./src/server/routes/routes');

const app = express();
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, viewsDir));
app.engine('handlebars', exphbs({ defaultLayout: 'main', layoutsDir: viewsDir + '/layouts' }));

app.use(session({
    store: new MongoStore( { url: dbUrl }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
}));
app.use(passport.initialize());
app.use(passport.session());

MongoClient.connect(dbUrl, (err, db) => {
    console.log('Connected successfully to Mongo');
    passportConfig(passport, db);
    routes(app, passport);
    app.listen(config.port, () => console.log(`App ready, running at port ${config.port}`));
});
