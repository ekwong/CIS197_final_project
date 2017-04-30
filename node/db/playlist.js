var mongo = require ('./mongo');
var uuid = require('node-uuid');

module.exports = {
  createUser: function (userID) {
    var playlists = [];
    var user = new mongo.Playlist({spotifyID: userID, playlists: playlists});
    user.save(function (error) {
      if (error) {console.log('error is: ', error);}
    });
  },

  containsUser: function (userID, callback) {
    console.log('Checking if database contains key: %s', userID);
    mongo.Playlist.findOne({spotifyID: userID}, callback);
  },

  addPlaylist: function (spotifyID, playlistID) {
    mongo.Playlist.findOne({spotifyID: spotifyID}, function (err, results) {
      var arr = results.playlists;
      if (arr.indexOf(playlistID) < 0) {
        arr.push(playlistID);
        results.playlists = arr;
        results.save(function (err) {
          if(err) {console.log('err in inserting, err');}
        });
      }
    });
  },

  getPlaylists: function (spotifyID, callback) {
    mongo.Playlist.findOne({spotifyID: spotifyID}, function (err, doc) {
      callback(err, doc);
    });
  }
};
