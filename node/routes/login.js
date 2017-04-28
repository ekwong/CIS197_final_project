var express = require('express');
var router = express.Router();

var spotify = require('../spotify');
var authorizeURL = spotify.authorizeURL;
// Provided - do not modify
var login = function (req, res) {
  res.redirect(authorizeURL);
}

module.exports = login;
