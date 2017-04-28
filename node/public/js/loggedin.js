$(document).ready(function () {
  document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var query = (document.getElementById('query').value);
    console.log(query);
    $.ajax({
      type: 'POST',
      url: '/search',
      data: {searchTerm: query},
      success: function (data) {
        console.log(JSON.stringify(data));
        $('#results').empty();
        var $list = $('<ul class="list-group"></ul>');
        for (var i in data) {
          var property = data[i];
          $('#results').append('<img src="' + property.image + '" height=300px width=300px >');
          for (var j in property) {
            var $item = $('<li class="list-group-item">' + j + ': ' + property[j] + '</li>');
            $list.append($item);
          }
        }
        $('#results').append($list);
        searchTopTracks(data[0].id);
      }
    });

}, false);
});

function searchTopTracks (artistID) {
  console.log('searching top tracks');
  $.ajax({
    type: 'POST',
    url: '/search_top_tracks',
    data: {searchTerm: artistID},
    success: function (data) {
      console.log('TRACKS ARE: ' + JSON.stringify(data));
      // $('#results').empty();
      var $deck = $('<div class="card-deck"></div>');
      var $heading = $('<h2>Top Tracks</h2>');
      $('#results').append($heading);
      $('#results').append($deck);
      
      
      data.forEach(function (track) {
        var $card = $('<div class="card"></div>');

        var $block = $('<div class="card-block"></div>');
        console.log(track.trackName);

        var $image = ('<img class="card-img-top" src="' + track.image + '" height=300px width=300px alt="Card image cap">');
        var $title = $('<h4 class="card-title"></h4>');
        $title.html(track.trackName);
        var $info = $('<p class="card-text"></p>');
        var $popularity = $info.clone().html('Popularity: ' + track.popularity);
        $info.html('Duration: ' + track.duration);

        $block.append($title);
        $block.append($info);
        $block.append($popularity);

        $card.append($image);
        $card.append($block);
        $deck.append($card);

      });
      // $('#results').append($deck);
   }   
  });
}

document.getElementById('makePlaylist-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var query = (document.getElementById('basedOnPlaylist').value);
    console.log(query);
    $.ajax({
      type: 'POST',
      url: '/search',
      data: {searchTerm: query},
      success: function (data) {
        console.log(JSON.stringify(data));
        $('#results').empty();
        var $list = $('<ul class="list-group"></ul>');
        for (var i in data) {
          var property = data[i];
          $('#results').append('<img src="' + property.image + '" height=300px width=300px >');
          for (var j in property) {
            var $item = $('<li class="list-group-item">' + j + ': ' + property[j] + '</li>');
            $list.append($item);
          }
        }
        $('#results').append($list);
        searchTopTracks(data[0].id);
      }
    });

}, false);
});