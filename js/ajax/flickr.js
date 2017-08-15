function getFlickr(marker, callback) {
    // Requests the 10 most interesting photos from flickr related to the spot
    // Stores an array of `photo` objects in the `marker` object
    // Using callback function makes sure the browser doesn't try to
    // view the photos before they are stored
    url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search';
    url += '&api_key=baeb88409c972395cb9304f5e6ace9a5';
    url += '&text=' + marker.title + ' trondheim';
    url += '&sort=interestingness-desc&content_type=1&media=photos';
    url += '&extras=owner_name%2C+url_m&per_page=10';
    url += '&format=json&nojsoncallback=1';
    $.getJSON(url, function(data) {
        var photos = data.photos.photo;
        marker.flickr = [];
        for (var i = 0; i < photos.length; i++) {
            var photo = {
                photographer: photos[i].ownername,
                url: photos[i].url_m,
                title: photos[i].title,
                heigth: photos[i].height_m,
                width: photos[i].width_m
            };
            marker.flickr.push(photo);
        }
        callback();
    }).fail(function() {
        callback();
    });
}