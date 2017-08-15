function getWiki(marker) {
    // Gets wikipedia url if found and stores it in the marker
    $.ajax({
        url: 'https://en.wikipedia.org/w/api.php?action=opensearch'+
             '&format=json&profile=normal&search=' + marker.title,
        dataType: "jsonp",
        success: function(data) {
            marker.wiki = data[3][0];
        }
    });
}