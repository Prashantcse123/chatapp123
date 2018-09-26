var User = require('./models/userModel')
var googleInfo = require('./Key')
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20')
FacebookStrategy = require('passport-facebook').Strategy;
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var chatRouter = require('./routes/chat')
var authGoogle = require('./routes/authProvider')

var mongoose = require('mongoose')
mongoose.connect('mongodb://172.19.0.1:27017/chatRoom', {
    useNewUrlParser: false
  }).then((response) => {
    console.log("Successfullt connected with MongoDB");
  })
  .catch(err => {
    console.log("Error:", err)
  })
var app = express();

app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

console.log("Hello")

app.use(passport.initialize());
app.use(passport.session());

function extractProfile(profile) {
  let imageUrl = '';
  if (profile.photos && profile.photos.length) {
    imageUrl = profile.photos[0].value;
  }
  return {
    id: profile.id,
    displayName: profile.displayName,
    image: imageUrl
  };
}

passport.use(new GoogleStrategy({
  callbackURL: googleInfo.google.callBackUrl,
  clientID: googleInfo.google.clientID,
  clientSecret: googleInfo.google.clientSecret
}, (accessToken, refreshToken, profile, done) => {
  console.log("Google called....")
  console.log('---------------------------------------------------')
  console.log('accessToken', accessToken)
  console.log('---------------------------------------------------')
  console.log('refreshToken', refreshToken)
  console.log('---------------------------------------------------')
  console.log('profile', profile);
  console.log('---------------------------------------------------')
  done(null, extractProfile(profile));
}));

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});


passport.use(new FacebookStrategy({
    clientID: '277867332830645',
    clientSecret: 'a1f9dea15d2abb403e5396854a501126',
    callbackURL: "http://localhost:4000/auth/facebook/redirect"
  },

  function (accessToken, refreshToken, profile, done) {
    console.log("Facebook called....")
    console.log('---------------------------------------------------')
    console.log('accessToken', accessToken)
    console.log('---------------------------------------------------')
    console.log('refreshToken', refreshToken)
    console.log('---------------------------------------------------')
    console.log('profile', profile);
    console.log('---------------------------------------------------')
    done(null, profile);
  }
));

app.use(require('express-session')({
  secret: "tHiSiSasEcRetStr",
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/chat', chatRouter)
app.use('/auth', authGoogle)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;