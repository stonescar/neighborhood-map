function getWiki(spot) {
    // Gets wikipedia url if found and stores it in the spot
    $.ajax({
        url: 'https://en.wikipedia.org/w/api.php?action=opensearch'+
             '&format=json&profile=normal&search=' + spot.name(),
        dataType: "jsonp",
        success: function(data) {
            spot.links.wikipedia(data[3][0]);
        }
    }).fail(function() {
        spot.links.wikipedia('FAILED');
    });
}