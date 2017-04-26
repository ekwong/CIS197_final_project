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
      console.log(data.body);
      callback(null, data.body);
    }, function(err) {
     console.log("Something went wrong!", err);
     callback(err);
   });
  };


  module.exports = {getMe, spotifyApi, authorizeURL, getNewReleases};