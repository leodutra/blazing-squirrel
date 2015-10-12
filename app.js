var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var i18n = require('i18next');
var config = require('config');


var routes = require('./routes/index');
var sql = require('./routes/sql');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// i18n
i18n.init(config.get("i18n"));
i18n.registerAppHelper(app);
app.use(i18n.handle);
// app.use(function setDefaultUserLanguage(req, res, next) {
//   var languages = req.acceptsLanguages();
//   if (languages) {
//     req.params.locale = languages[0];
//   }
//   console.log(req.query.locale, req.params.locale);
//   next();
// });

// ADD CONFIG TO JADE AND ALL THE EXPRESS APP
app.locals.config = config;
//

// ROUTES
app.use('/', routes);
app.use('/sql', sql);

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
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;