// Functions for getting information about spot from foursquare.
// Using callback functions makes sure data is stored before viewing

function getFsVenue(marker, callback) {
    // Initial foursquare request to get id and other information. Id will be used
    // for future API calls to foursquare
    var query = marker.title;
    var ll = marker.getPosition().lat() + ',' + marker.getPosition().lng();
    var url = 'https://api.foursquare.com/v2/venues/search?';
    url += 'll=' + ll;
    url += '&query=' + query;
    url += '&client_id=ZZTS53CJLJJGNTDJO0LEAYCWHVFO4DR4MVA2IOKNBDRPX1VK';
    url += '&client_secret=BQK22KCLX2TVVVMDDZZGZKSCOXWO054PG13PYKLPJI5QPBCC';
    url += '&v=20170808';
    $.getJSON(url, function(data) {
        // See if a venue matches the name exactly
        for (var i = 0; i < data.response.venues.length; i++) {
            if (data.response.venues[i].name == query) {
                var venue = data.response.venues[i];
                break;                
            }
        }
        // If no direct match, use first venue
        if (!venue) {
            var venue = data.response.venues[0];
        }
        marker.fs_id = venue.id;
        marker.address = venue.location.formattedAddress;
        marker.phone = venue.contact.formattedPhone;
        marker.category = venue.categories[0].name;
        marker.webpage = venue.url;
        marker.social = {
            facebook: venue.contact.facebook,
            twitter: venue.contact.twitter
        }
        callback();
    }).fail(function() {
        infoWindow.setContent('<h4>' + query + '</h4><p>Could not get details for ' + query +
            '</p><button class="btn btn-sm btn-primary" onclick="openModal()">More info...</button>');
    });
}

function getFsTips(marker, callback) {
    // Gets the most popular tip from foursquare
    url = 'https://api.foursquare.com/v2/venues/' + marker.fs_id + '/tips';
    url += '?client_id=ZZTS53CJLJJGNTDJO0LEAYCWHVFO4DR4MVA2IOKNBDRPX1VK';
    url += '&client_secret=BQK22KCLX2TVVVMDDZZGZKSCOXWO054PG13PYKLPJI5QPBCC';
    url += '&sort=popular&limit=3&v=20170809';
    $.getJSON(url, function(data) {
        if (data.response.tips.items.length > 0) {
            var tip = data.response.tips.items[0];
            marker.fsReview = {};
            marker.fsReview = {
                text: tip.text,
                user: {
                    name: tip.user.firstName + ' ' + (tip.user.lastName || ''),
                    picture: tip.user.photo.prefix + '30x30' + tip.user.photo.suffix
                },
                url: tip.canonicalUrl
            };
            callback();
        }
    });
}

function getFsVenueDetails(marker, callback) {
    // Gets additional information about the venue
    // (rating, url to foursquare page and opening hours)
    url = 'https://api.foursquare.com/v2/venues/' + marker.fs_id;
    url += '?client_id=ZZTS53CJLJJGNTDJO0LEAYCWHVFO4DR4MVA2IOKNBDRPX1VK';
    url += '&client_secret=BQK22KCLX2TVVVMDDZZGZKSCOXWO054PG13PYKLPJI5QPBCC';
    url += '&v=20170809';
    $.getJSON(url, function(data) {
        venue = data.response.venue;
        marker.fs_url = venue.canonicalUrl;
        if (venue.rating) {
            marker.fs_rating = venue.rating.toFixed(1);
        }
        if (venue.hours) {
            marker.hours = venue.hours;
        }
        callback();
    }).fail(function() {
        callback();
    });
}