var playlist = require('./db/playlist.js');
var SpotifyWebApi = require('spotify-web-api-node');
var credentials = require('./config');
var scopes = ['playlist-read-collaborative', 'playlist-modify-public', 'user-library-read', 'user-read-private', 'playlist-read-private', 'user-read-email', 'playlist-modify-private', 'user-library-modify'];

var Q = require('q');
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
  spotifyApi.searchArtists(artist, {limit:15, offset: 0})
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
  spotifyApi.getArtistTopTracks(artist, {limit: 3})
  .then(function(data) {
    console.log(JSON.stringify(processTopTracks(data.body.tracks)));
    callback(null, processTopTracks(data.body.tracks));
  }, function(err) {
    console.log('Something went wrong in artist top tracks', err);
  });
};

var getUserPlaylists = function (user, callback) {
  // Get a user's playlists
  spotifyApi.getUserPlaylists(user)
  .then(function(data) {
      // console.log('Retrieved playlists', JSON.stringify(data.body.items));
      callback(null, processPlaylists(data.body.items));
    },function(err) {
      console.log('Something went wrong in getting user playlists', err);
    });
};

var getPlaylist = function (user, playlist, callback) {
  // Get a playlist
  spotifyApi.getPlaylist(user, playlist)
  .then(function(data) {
      // console.log('Some information about this playlist', JSON.stringify(processPlaylist(data.body.tracks.items)));
      callback(null, processPlaylist(data.body.tracks.items));
    }, function(err) {
      console.log('Something went wrong in getting playlist', err);
    });
}

var createPlaylist = function  (user, playlistName, callback) {
  console.log("user is: " + user);
  console.log('playlistname is: ' + playlistName);
  // Create a private playlist
  spotifyApi.createPlaylist(user, playlistName, { 'public' : false})
  .then(function(data) {
    console.log('Created playlist!');
    callback(null, {user: user, playlistName: playlistName, playlistID: data.id});
    console.log('playlist data: ' + JSON.stringify(data));
  }, function(err) {
    console.log('Something went wrong in creating playlist', err);
  });
}

var createPlaylistFromArtist = function (user, artistID, playlistName) {
  return spotifyApi.getArtistRelatedArtists(artistID)
  .then(function(data) {

    if (data.body.artists.length) {
      // Print the number of similar artists
      console.log('I got ' + data.body.artists.length + ' similar artists!');

      console.log('The most similar one is ' + data.body.artists[0].name);
      var shortened = data.body.artists.slice(0, 5);
      return shortened.map(function (artist) { return artist.id; });
    } else {
      console.log('I didn\'t find any similar artists.. Sorry.');
    }
    
  }, function(err) {
    console.log('Something went wrong..', err.message);
  }).then (function (artistIDs) {
    console.log('artist IDS:**** ' + artistIDs);
    var promises = artistIDs.map(function (artistID) {
      console.log('artist ID is: ' + artistID);
      return spotifyApi.getArtistTopTracks(artistID, 'US')
      .then(function(data) {
        //cut it down to top 5 songs if want
        return processTopTracks(data.body.tracks);
      }, function(err) {
        console.log('Something went wrong in artist top tracks', err);
      });
    });
    return Q.all(promises).then(function (results) {
      console.log("RESULTS: " + JSON.stringify(results));
      return Array.prototype.concat.apply([], results);
    });
  })
  .then (function (artistTracks) {
    console.log('artist tracks***: ' + JSON.stringify(artistTracks));
    return spotifyApi.createPlaylist(user, playlistName, { 'public' : false})
    .then (function (data) {
      console.log("artistTracks: " + JSON.stringify(artistTracks));
      playlist.addPlaylist(user, data.body.id);
      return spotifyApi.addTracksToPlaylist(user, data.body.id, artistTracks);
    });
  });
}

function processData (data) {
  var arr = [];
  for (var i in data) {
    var artist = data[i];
    var obj = {
      id: artist.id,
      followers: artist.followers.total,
      name: artist.name,
      popularity : artist.popularity,
      genres: artist.genres
    };
    if (artist.images.length > 0) {
      obj.image = artist.images[0].url;
    }
    arr.push(obj);
  }
  console.log('result of processData is: ' + arr);
  return arr;
}

function processTopTracks (tracks) {
  var arr = [];
  for (var i in tracks) {
    var track = tracks[i];
    // var obj = {
      // image: track.album.images[0].url,
      // duration: track.duration_ms,
      // id: track.id,
      // trackName: track.name,
      // preview_url: track.preview_url,
      // uri: track.uri,
      // popularity: track.popularity
    // };
    // arr.push(obj);
    arr.push(track.uri);
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
  // console.log('playlist is: ' + JSON.stringify(playlist));
  playlist.forEach(function (item) {
    var obj = {
      trackName: item.track.name,
      trackID: item.track.id,
      preview_url: item.track.preview_url,
      uri: item.track.uri,
    };
    var artists = [];
    for (var i = 0; i < item.track.artists.length; i++) {
      artists.push(item.track.artists[i].name);
    }
    obj.artists = artists;
    arr.push(obj);
  });
  return arr;
}

module.exports = {getMe, spotifyApi, authorizeURL, getNewReleases, searchArtists, searchTracks,
  getArtistTopTracks,
  getUserPlaylists,
  getPlaylist,
  createPlaylist,
  createPlaylistFromArtist,
  processPlaylists,
processPlaylist};