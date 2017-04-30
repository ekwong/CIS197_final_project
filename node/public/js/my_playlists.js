$(document).ready(function () {
  $(".hide").click(function(){
    $($(this) + ' > table')hide();
});

$(".show").click(function(){
    $($(this) + ' > table').show();
});
});
function searchTopTracks (artistID) {
  console.log('searching top tracks');
  $.ajax({
    type: 'POST',
    url: '/search_top_tracks',
    data: {searchTerm: artistID},
    success: function (data) {
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
