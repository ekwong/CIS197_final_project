var SpotifyWebApi = require('spotify-web-api-node');
var credentials = require('./config');
var scopes = ['user-read-private', 'user-read-email'];

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: credentials.client_id,
  clientSecret: credentials.client_secret,
  redirectUri: credentials.callback_URL
});

// Create the authorization URL
var authorizeURL = spotifyApi.createAuthorizeURL(scopes);
var getMe = function (callback) {
  spotifyApi.getMe()
  .then(function(data) {
    callback(null, data.body);
    console.log('Some information about the authenticated user', data.body);
  }, function(err) {
    console.log('Something went wrong!', err);
    callback(err);
  });
};

var getNewReleases = function (callback) {
  // Retrieve new releases
  spotifyApi.getNewReleases({ limit : 5, offset: 0, country: 'SE' })
  .then(function(data) {
    console.log('this is the data: ' + JSON.stringify(data.body));
    callback(null, data.body);
  }, function(err) {
   console.log("Something went wrong!", err);
   callback(err);
 });
};

var searchArtists = function (artist, callback) {
  // Search artists whose name contains 'Love'
  spotifyApi.searchArtists(artist, {limit:1, offset: 0})
    .then(function(data) {
      // console.log('Search artists by ' + artist + ': ', JSON.stringify(data.body.artists.items));
      callback(null, processData(data.body.artists.items));
    }, function(err) {
      console.error(err);
    });
};

var searchTracks = function (searchTerm, callback) {
  // Search tracks whose artist's name contains 'Kendrick Lamar', and track name contains 'Alright'
  spotifyApi.searchTracks(searchTerm, {limit:5, offset: 0})
    .then(function(data) {
      // console.log('Search tracks by ' + searchTerm + ': ', JSON.stringify(data.body));
      callback(null, data.body);
    }, function(err) {
      console.log('Something went wrong!', err);
    });

};

var getArtistTopTracks = function (artist, callback) {
  console.log('artist for top track is: ' + artist);
  // Get an artist's top tracks
  spotifyApi.getArtistTopTracks(artist, 'US')
    .then(function(data) {
      console.log(JSON.stringify(processTopTracks(data.body.tracks)));
      callback(null, processTopTracks(data.body.tracks));
      }, function(err) {
      console.log('Something went wrong!', err);
    });
};

var getUserPlaylists = function (user, callback) {
  // Get a user's playlists
  spotifyApi.getUserPlaylists(user)
    .then(function(data) {
      console.log('Retrieved playlists', JSON.stringify(data.body.items));
      callback(null, processPlaylists(data.body.items));
    },function(err) {
      console.log('Something went wrong!', err);
    });
};

var getPlaylist = function (user, playlist, callback) {
  // Get a playlist
  spotifyApi.getPlaylist(user, playlist)
    .then(function(data) {
      console.log('Some information about this playlist', JSON.stringify(processPlaylist(data.body.tracks.items)));
      callback(null, processPlaylist(data.body.tracks.items));
    }, function(err) {
      console.log('Something went wrong!', err);
    });
}

var createPlaylist = function  (user, playlistName, callback) {
  // Create a private playlist
  spotifyApi.createPlaylist(user, playlistName, { 'public' : false })
    .then(function(data) {
      console.log('Created playlist!');
      callback(null, {user: user, playlistName: playlistName});
    }, function(err) {
      console.log('Something went wrong!', err);
    });
}

function processData (data) {
  var arr = [];
  for (var i in data) {
    var artist = data[i];
    var obj = {
      id: artist.id,
      followers: artist.followers.total,
      image: artist.images[0].url,
      name: artist.name
    }
    arr.push(obj);
  }
  // console.log('result of processData is: ' + arr);
  return arr;
}

function processTopTracks (tracks) {
  var arr = [];
  for (var i in tracks) {
    var track = tracks[i];
    var obj = {
      image: track.album.images[0].url,
      duration: track.duration_ms,
      id: track.id,
      trackName: track.name,
      preview_url: track.preview_url,
      uri: track.uri,
      popularity: track.popularity
    };
    arr.push(obj);
  }
  // console.log('result of processTopTracks is: ' + arr.toString());
  return arr;
}

function processPlaylists(items) {
  var arr = [];
  items.forEach(function (playlist) {
    var obj = {
      name: playlist.name,
      id: playlist.id,
      uri: playlist.uri,
      total: playlist.tracks.total
    };
    arr.push(obj);
  });
  return arr;
}

function processPlaylist(playlist) {
  var arr = [];
  console.log('playlist is: ' + JSON.stringify(playlist));
  playlist.forEach(function (item) {
    var obj = {
      trackName: item.track.name,
      trackID: item.track.id,
      preview_url: item.track.preview_url,
      uri: item.track.uri,
      artists: item.track.artists
    };
    arr.push(obj);
  });
  return arr;
}

  module.exports = {getMe, spotifyApi, authorizeURL, getNewReleases, searchArtists, searchTracks,
    getArtistTopTracks,
    getUserPlaylists,
    getPlaylist};