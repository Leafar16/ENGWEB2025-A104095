var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db = require('./db/db');

const {v4 : uuidv4} = require('uuid')
var session = require('express-session')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy  

var indexRouter = require('./routes/index');

var app = express();

app.use(session({
  genid: req => {
    return uuidv4()
  }
  , secret: 'EngWeb2025',
  resave: false,
  saveUninitialized: true,
}))

db.openDB();

var User = require('./models/user')
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/', indexRouter);


app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
});

module.exports = app;