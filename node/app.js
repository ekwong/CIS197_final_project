var express = require('express');
var app = express();
var uuid = require('node-uuid');
var spotify = require('./spotify');
var authorizeURL = spotify.authorizeURL;
var spotifyApi = spotify.spotifyApi;

var login = require('./routes/login');
var callback = require('./routes/callback');
// Serve static pages
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));

app.get('/', login);

app.get('/callback', callback);

app.get('/spotify', function (req, res) {
  spotify.getMe(function (err, result) {
    console.log("results: " + result);
  });
  spotify.getNewReleases(function (err, results) {
    console.log("result of new releases: " + results);
    res.render('loggedin', {newReleases: results});
  })
})

// Generate a random cookie secret for this app
var generateCookieSecret = function () {
  return 'iamasecret' + uuid.v4();
};
// TODO (Part 3) - Use the cookieSession middleware. The above function
// can be used to generate a secret key. Make sure that you're not accidentally
// passing the function itself - you need to call it to get a string.

var cookieSession = require('cookie-session');
var randCookie = generateCookieSecret();
app.use(cookieSession({
  name: 'session',
  secret: randCookie
}));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
// Mount your routers. Please use good style here: mount a single router per use() call,
// preceded only by necessary middleware functions.
// DO NOT mount an 'authenticating' middleware function in a separate call to use().
// For instance, the API routes require a valid key, so mount checkValidKey and apiRouter in the same call.
// var keysRouter = require('./routes/keys');
// app.use('/', keysRouter);

// var loginRouter = require('./routes/login');
// app.use('/', loginRouter);

// var isAuthenticated = require('./middlewares/isAuthenticated');
// var reviewsRouter = require('./routes/reviews');
// app.use('/reviews', isAuthenticated, reviewsRouter);

// var checkValidKey = require('./middlewares/checkValidKey');
// var apiRouter = require('./routes/api');
// app.use('/api', checkValidKey, apiRouter);

var handleError = require('./middlewares/handleError');
app.use(handleError);

var pageNotFound = require('./middlewares/pageNotFound');
app.use(pageNotFound);

// Mount your error-handling middleware.
// Please mount each middleware function with a separate use() call.

module.exports = app;
