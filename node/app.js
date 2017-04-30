var express = require('express');
var app = express();
var uuid = require('node-uuid');
var spotify = require('./spotify');
var authorizeURL = spotify.authorizeURL;
var spotifyApi = spotify.spotifyApi;
var Q = require('q');
var playlist = require('./db/playlist');

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

app.get('/', function (req, res) {
  var authorizeURL = spotify.authorizeURL;
  res.redirect(authorizeURL);
});

app.get('/callback', callback);

var user = '';
app.get('/spotify', function (req, res) {
  spotifyApi.getMe().then(function (data) {
    user = data.body.id;
    playlist.containsUser(user, function (err, data) {
      if (!data) {
        playlist.createUser(user);
      }
    });
    res.render('loggedin.ejs');
  });
});

app.post('/create_artist_playlist', function (req, res) {
  var artistID = req.body.artistID;
  var artistName = req.body.artistName;
  spotify.createPlaylistFromArtist(user, artistID, 'Playlist Based on ' + artistName)
  .then (function (data) {
    res.send();
  });
});

app.get('/my_playlists', function (req, res) {
  playlist.getPlaylists(user, function (err, data) {
    if (data == null) {console.log('no playlists for user'); res.render('my_playlists.ejs', {playlists: []}); return;}
    var playlists = data.playlists;
    var promises = playlists.map(function (playlist) {
      return spotifyApi.getPlaylistTracks(user, playlist)
      .then(function(data) {
        return data;
      }, function(err) {
        console.log('Something went wrong in playlist track', err);
      });
    });
    return Q.all(promises).then (function (results) {
      // console.log("as;dlkfjas;dklfjas;dlfkja;s" + JSON.stringify(results));
      var arr = Array.prototype.concat.apply([], results);
      // console.log('arr is: ' + JSON.stringify(arr));
      // console.log('length is: ' + JSON.stringify(arr[3]));
      console.log("IN MY PLAYLISTS");
      var rev = [];
      arr.forEach(function (playlist) {
        console.log("playlist: " + JSON.stringify(playlist));
        var cur = spotify.processPlaylist(playlist.body.items);
        rev.push(cur);
      });
      res.render('my_playlists.ejs', {playlists: rev});
      return;
    });
  });
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
    res.send(results);
  });
});

app.post('/create_recommended_playlist', function (req, res) {
  var user = req.body.user;
  var playlistName = req.body.playlistName;
  var basedOnPlaylist = req.body.basedOnPlaylist;
  console.log('begin');
  spotify.createPlaylist(user, playlistName, function (err, results) {
    spotify.getUserPlaylist(user, basedOnPlaylist, function (err, tracks) {
      tracks.forEach(function (track) {
        var artistsSeen = {};
        var toAdd = [];
        console.log("HERE");
        track.artists.forEach(function (artist) {
          if (!artistsSeen.hasOwnProperty(artist)) {
            artistsSeen[artist] = true;
            
            spotify.getArtistTopTracks(artist.id, function (err, topTracks) {
              for (var i = 0; i < 3; i++) {
                toAdd.push(topTracks[i].uri);
              }
              spotifyApi.addTracksToPlaylist(user, playlistName, topTracks)
              .then(function (data) {
                res.send({playlistname: playlistName});
              });
            });
          }
        });
      });
    });
    // res.send(results);
  });

});
app.get('/playlist_extender', function (req, res) {
    spotify.getMe(function (err, result) {
    console.log("results: " + JSON.stringify(result));
    var user = result.id;
    spotify.getUserPlaylists(user, function (err, result1) {
      // console.log('user playlists are : ' + JSON.stringify(result1));
      spotify.getPlaylist(user, result1[0].id, function (err, tracks) {
        // console.log("TRACKS: " + JSON.stringify(tracks));
        console.log("USER PLAYLISTS: " + JSON.stringify(result1));
        res.render('playlist_extender.ejs', {user: user, playlists: result1, tracks: tracks});
      });
    });
  });
});

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

var handleError = require('./middlewares/handleError');
app.use(handleError);

var pageNotFound = require('./middlewares/pageNotFound');
app.use(pageNotFound);

// Mount your error-handling middleware.
// Please mount each middleware function with a separate use() call.

module.exports = app;
