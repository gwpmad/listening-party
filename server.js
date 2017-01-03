require('dotenv').config();
const env = process.ENV || 'default';
const config = require(`./config/${env}`);

const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const viewsDir = 'src/server/views';

const passport = require('passport');
const passportConfig = require('./src/server/config/passport');
const connectFlash = require('connect-flash');
const routes = require('./src/server/routes/routes');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const MongoDb = require('./src/server/mongo');
const MongoClient = MongoDb.MongoClient;
const dbUrl = process.env.MONGO_URI;


const app = express();
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, viewsDir));
app.engine('handlebars', exphbs({ defaultLayout: 'main', layoutsDir: viewsDir + '/layouts' }));
app.use(express.static('src/client'));

app.use(connectFlash());
app.use(session({
    store: new MongoStore({ url: dbUrl }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
}));
app.use(passport.initialize());
app.use(passport.session());

MongoClient.connect(dbUrl)
    .then(db => {
        console.log('Connected successfully to Mongo');
        passportConfig(passport, db);
        routes(app, passport);
        app.listen(config.port, () => console.log(`App ready, running at port ${config.port}`));
    })
    .catch(err => {
        console.log('Error connecting to Mongo:', err);
    });