const express = require('express');
const passport = require('passport');
const expressSession = require('express-session');
const MongoClient = require('mongodb').MongoClient;
const dbUrl = 'mongodb://<dbuser>:<dbpassword>' + process.env.MONGO_URI;

const app = express();
app.use(expressSession({ secret: process.env.SESSION_SECRET }));
app.use(passport.initialize());
app.use(passport.session());

MongoClient.connect(dbUrl, (err, db) => {
  console.log('Connected successfully to server');
});
UserModel.findOne({_id: id}, function (err, user) { ... });
