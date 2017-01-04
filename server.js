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

const SuspiciousLoginsEmitter = require('./src/server/events/SuspiciousLoginsEmitter.js');


const app = express();
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, viewsDir));
app.engine('handlebars', exphbs({ defaultLayout: 'main', layoutsDir: `${viewsDir}/layouts` }));
app.use(express.static('src/client'));

app.use(connectFlash());
app.use(session({
  store: new MongoStore({ url: dbUrl }),
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  rolling: true,
  cookie: {
    maxAge: 30 * 60 * 1000,
  }
}));
app.use(passport.initialize());
app.use(passport.session());

MongoClient.connect(dbUrl)
  .then((db) => {
    console.log('Connected successfully to Mongo');
    passportConfig(passport, db);
    routes(app, passport, new SuspiciousLoginsEmitter());
    app.listen(config.port, () => console.log(`App ready, running at port ${config.port}`));
  })
  .catch((err) => {
    console.error('Error connecting to Mongo:', err);
  });
