$(document).ready(function () {
  $('table').hide();
  document.getElementById('search-form').addEventListener('submit', function (e) {
    e.stopImmediatePropagation();
    e.preventDefault();
    var query = (document.getElementById('query').value);
    console.log(query);
    $.ajax({
      type: 'POST',
      url: '/search',
      data: {searchTerm: query},
      success: function (data) {
        // console.log(JSON.stringify(data));
        $('#results').empty();
        // var $list = $('<ul class="list-group"></ul>');
        // for (var i in data) {
        //   var property = data[i];
        //   $('#results').append('<img src="' + property.image + '" height=300px width=300px >');
        //   for (var j in property) {
        //     var $item = $('<li class="list-group-item">' + j + ': ' + property[j] + '</li>');
        //     $list.append($item);
        //   }
        // }
        // $('#results').append($list);
        // searchTopTracks(data[0].id);
        populateTable(data);
      }
    });

  }, true);
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
      var $row = $('<div class="row"></div>');
      var $singleRow = $row.clone();
      var $deck = $('<div class="card-deck"></div>');
      var $singleDeck = $deck.clone();
      var $heading = $('<h2 class="text-center">Top Tracks</h2>');
      $('#results').append($heading);

      var $col = $('<div class="col-md-4"></div>');
      $('#results').append($singleRow);
      data.forEach(function (track, index) {
        var $card = $('<div class="card"></div>');
        var $singleCol = $col.clone().append($card);
        if (index % 3 == 0) {
          $singleRow = $row.clone();
          $singleDeck = $deck.clone();
          $singleRow.append($singleDeck);
          $('#results').append($singleRow);
        }
        $singleDeck.append($singleCol);

        var $block = $('<div class="card-block"></div>');

        var $image = ('<img class="card-img-top" src="' + track.image + '" style="max-height:287.984px" alt="Card image cap">');
        var $title = $('<h5 class="card-title"></h5>');
        $title.html(track.trackName);
        var $info = $('<p class="card-text"></p>');
        var $popularity = $info.clone().html('Popularity: ' + track.popularity);
        $info.html('Duration: ' + track.duration);

        $block.append($title);
        $block.append($info);
        $block.append($popularity);

        $card.append($image);
        $card.append($block);
        $singleRow.append($singleDeck);

      });
    }   
  });
}

function populateTable (artists) {
  $('#search-artists > tr').empty();
  for (var i = 0; i < artists.length; i++) {
    var $tr = $('<tr class="artist"></tr>');
    $tr.attr('data-artist-id', artists[i].id);
    $tr.attr('data-artist-name', artists[i].name);
    $tr.append($('<td>' + artists[i].name + '</td>'));
    $tr.append($('<td>' + artists[i].followers + '</td>'));
    $tr.append($('<td>' + artists[i].popularity + '</td>'));
    $tr.append($('<td>' + artists[i].genres + '</td>'));
    $('#search-artists > tbody').append($tr);
  }
  $('.artist').click(function (e) {
    console.log('clicked');
    e.preventDefault();
    $.post('/create_artist_playlist', { artistID: $(this).data('artist-id'), artistName: $(this).data('artist-name') })
    .done(function (data) {
      window.location = '/my_playlists';
    });

    // displayNewPlaylist($.data(this, id));
    console.log('this artist id is: ' + $(this).data('artistid'));
  });
  $(".artist").hover(function() {
    $(this).css('cursor','pointer');
}, function() {
    $(this).css('cursor','auto');
});
  $('#search-artists').show();
}

function displayNewPlaylist (playlist) {
  $('new-playlist').empty();
  for (var i = 0; i < tracks.length; i++) {
    var $tr = $('<tr></tr>');
    $tr.append($('<td>' + tracks[i].track + '</td>'));
    $tr.append($('<td>' + tracks[i].artists + '</td>'));
    $tr.append($('<td>' + tracks[i].preview_url + '</td>'));
    $('#new-playlist').append($tr);
  }
  $('#new-playlist').show();
}