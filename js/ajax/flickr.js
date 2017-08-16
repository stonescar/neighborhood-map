function getFlickr(spot) {
    // Requests the 10 most interesting photos from flickr related to the spot
    // Pushes objects into the observable array `flickr` in the spot
    url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search';
    url += '&api_key=baeb88409c972395cb9304f5e6ace9a5';
    url += '&text=' + spot.name() + ' trondheim';
    url += '&sort=interestingness-desc&content_type=1&media=photos';
    url += '&extras=owner_name%2C+url_m&per_page=10';
    url += '&format=json&nojsoncallback=1';
    $.getJSON(url, function(data) {
        var photos = data.photos.photo;
        for (var i = 0; i < photos.length; i++) {
            var photo = {
                photographer: photos[i].ownername,
                url: photos[i].url_m,
                title: photos[i].title
            };
            spot.flickr.push(photo);
            spot.flickrStatus('success');
        }
    }).fail(function() {
        spot.flickrStatus('fail');
    });
}