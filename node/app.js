var express = require('express');
var app = express();
var uuid = require('node-uuid');
var spotify = require('./spotify');
var authorizeURL = spotify.authorizeURL;
var spotifyApi = spotify.spotifyApi;

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

var login = require('./routes/login');
var callback = require('./routes/callback');
// Serve static pages
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', login);

app.get('/callback', callback);

var user = '';
app.get('/spotify', function (req, res) {
  spotify.getMe(function (err, result) {
    // console.log("results: " + result);
    user = result.id;
    spotify.getUserPlaylists(user, function (err, result1) {
      // console.log('user playlists are : ' + JSON.stringify(result1));
      spotify.getPlaylist(user, result1[0].id, function (err, tracks) {
        console.log("TRACKS: " + JSON.stringify(tracks));
        res.render('loggedin.ejs', {user: user, playlists: result1, tracks: tracks});
      });
    });
  });
  // spotify.getNewReleases(function (err, results) {
  //   console.log("result of new releases: " + results);
  // });
  // spotify.searchArtists('Rihanna', function (err, results) {
  //   console.log('result of call to searchArtists is: ' + JSON.stringify(results));
  //   res.render('loggedin');
  // });
});

app.post('/search', function (req, res) {
  var search = req.body.searchTerm;
  console.log('search term is: ' + search);
  spotify.searchArtists(search, function (err, results) {
    res.send(results);
  });
});

app.post('/create_playlist', function (req, res) {
  var user = req.body.user;
  var playlistName = req.body.playlistName;
  spotify.createPlaylist(user, playlistName, function (err, results) {
    res.send(results);
  });
})

app.post('/search_top_tracks', function (req, res) {
  var search = req.body.searchTerm;
  spotify.getArtistTopTracks(search, function (err, results) {
    console.log('TOP TRACKS ARE: ' + JSON.stringify(results));
    res.send(results);
  });
});

app.post('/create_recommended_playlist', function (req, res) {
  var user = req.body.user;
  var playlistName = req.body.playlistName;
  var basedOnPlaylist = req.body.basedOnPlaylist;
  spotify.createPlaylist(user, playlistName, function (err, results) {
    spotify.getUserPlaylist(user, basedOnPlaylist, function (err, tracks) {
      tracks.forEach(function (track) {
        var artistsSeen = {};
        track.atrists.forEach(function (artist) {
          if (!artistsSeen.hasOwnProperty(artist)) {
            artistsSeen[artist] = true;
            var toAdd = [];
            spotify.getArtistTopTracks(artist.id, function (err, topTracks) {
              for (var i = 0; i < 3; i++) {
                toAdd.push(topTracks[i].uri);
              }
              spotifyApi.addTracksToPlaylist(user, playlistName, topTracks);
            });
          }
        });
      });
    });
    res.send(results);
  });

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
