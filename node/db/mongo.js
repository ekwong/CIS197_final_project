var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cis197final', function (err) {
  if (err && err.message.includes('ECONNREFUSED')) {
    console.log('Error connecting to mongodb database: %s.\nIs "mongod" running?', err.message);
    process.exit(0);
  } else if (err) {
    throw err;
  } else {
    console.log('DB successfully connected. Adding seed data...');
  }
});

var db = mongoose.connection;

var playlistSchema = new mongoose.Schema({
  spotifyID: String,
  playlists: [String]
});

var Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = {
  Playlist: Playlist,
  mongoose: mongoose
};
