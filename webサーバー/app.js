var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// ここで読み込むことで、dbのコネクションを開けている
var mongo = require('./routes/dbModel');

var logincheck = require('./routes/logincheck');
var reportcheck = require('./routes/reportcheck');
var deletecheck = require('./routes/deletecheck');

var features = require('./routes/features');
var room = require('./routes/room');
var chat = require('./routes/chat');
var history = require('./routes/history');
var map = require('./routes/map');
var settings = require('./routes/settings');
var faq = require('./routes/faq');
var restrict = require('./routes/restrict');
var policy = require('./routes/policy');
var login = require('./routes/login');

var app = express();

/*
app.use(function(req, res, next) {
    if(!(req.secure)) {
        res.redirect('https://' + req.get('Host') + req.url);
    } else {
        next();
    }
});
*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', features);
app.use('/features', features);
app.use('/room', room);
app.use('/chat', chat);
app.use('/history', history);
app.use('/map', map);
app.use('/settings', settings);
app.use('/faq', faq);
app.use('/restrict', restrict);
app.use('/policy', policy);
app.use('/login', login);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      //message: err.message,
      //error: err
      message: 'Server is currently busy. Please try again later.',
      error: {}
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    //message: err.message,
    message: 'Server is currently busy. Please try again later.',
    error: {}
  });
});

// エラーが起きてもサーバーが落ちないように(開発中はエラー知りたいので、コメントアウト)
/*
process.on('uncaughtException', function(err) {
    console.log(err);
});
*/

module.exports = app;
