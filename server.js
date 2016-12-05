require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const passport = require('passport');
const passportConfig = require('./src/server/config/passport');
const routes = require('./src/server/routes/routes');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const MongoClient = require('mongodb').MongoClient;
const dbUrl = 'mongodb://<dbuser>:<dbpassword>' + process.env.MONGO_URI;
 console.log("dbUrl ", dbUrl);

const app = express();
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src/server/views'));



app.use(session({ store: new MongoStore( { url: dbUrl }) }));
app.use(passport.initialize());
app.use(passport.session());

MongoClient.connect(dbUrl, (err, db) => {
  console.log('Connected successfully to server');
  passportConfig(passport, db);
  routes(app, passport);
  app.listen(8080, () => console.log('App ready'));
});
