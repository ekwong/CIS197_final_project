$(document).ready(function () {

  document.getElementById('makePlaylist-form').addEventListener('submit', function (e) {
    // e.stopImmediatePropagation();
    e.preventDefault();
    var basedOnPlaylist = (document.getElementById('basedOnPlaylist').value);
    var playlistName = document.getElementById('newPlaylistName').value;
    var user = $('#user').text();
    console.log(user);
    console.log("basedOnPlaylist and playlistName is: " + basedOnPlaylist + ' ' + playlistName);
    $.ajax({
      type: 'POST',
      url: '/create_recommended_playlist',
      data: {playlistName: playlistName,
        basedOnPlaylist: basedOnPlaylist,
        user: user},
      success: function (data) {
        var $success = $('<p>New Playlist ' + playlistName + ' created!</p>');
        $('#results').prepend($success);
      }
    });

}, false);
});