var spotify = require('../spotify');
var spotifyApi = spotify.spotifyApi;

var processCallback = function (req, res) {
  if (req.query.error) {
    console.log("error is: " + req.query.error);
  }
  var authCode = req.query.code;
  
  // Retrieve an access token and a refresh token
  spotifyApi.authorizationCodeGrant(authCode)
    .then(function(data) {
      console.log('The token expires in ' + data.body['expires_in']);
      console.log('The access token is ' + data.body['access_token']);
      console.log('The refresh token is ' + data.body['refresh_token']);

      // Set the access token on the API object to use it in later calls
      spotifyApi.setAccessToken(data.body['access_token']);
      spotifyApi.setRefreshToken(data.body['refresh_token']);
      res.redirect("/spotify");
    }, function(err) {
      console.log('Something went wrong!', err);
    });
};
module.exports = processCallback;