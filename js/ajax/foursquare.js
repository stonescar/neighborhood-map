// Functions for getting information about spot from foursquare.

function getFsVenue(spot) {
    // Initial foursquare request to get id and other information. Id will be used
    // for future API calls to foursquare
    var query = spot.name();
    var ll = spot.marker.getPosition().lat() + ',' + spot.marker.getPosition().lng();
    var url = 'https://api.foursquare.com/v2/venues/search?';
    url += 'll=' + ll;
    url += '&query=' + query;
    url += '&client_id=ZZTS53CJLJJGNTDJO0LEAYCWHVFO4DR4MVA2IOKNBDRPX1VK';
    url += '&client_secret=BQK22KCLX2TVVVMDDZZGZKSCOXWO054PG13PYKLPJI5QPBCC';
    url += '&v=20170808';
    $.getJSON(url, function(data) {
        // See if a venue matches the name exactly
        var venue;
        for (var i = 0; i < data.response.venues.length; i++) {
            if (data.response.venues[i].name == query) {
                venue = data.response.venues[i];
                break;                
            }
        }
        // If no direct match, use first venue
        if (!venue) {
            venue = data.response.venues[0];
        }
        spot.fsId = venue.id;
        spot.address(venue.location.formattedAddress);
        spot.phone(venue.contact.formattedPhone);
        spot.category(venue.categories[0].name);
        spot.links.website(venue.url);
        spot.links.facebook(venue.contact.facebook);
        spot.links.twitter(venue.contact.twitter);
        spot.fsStatus('success');
    }).fail(function() {
        spot.fsStatus('fail');
    });
}

function getFsTips(spot) {
    // Gets the most popular tip from foursquare
    url = 'https://api.foursquare.com/v2/venues/' + spot.fsId + '/tips';
    url += '?client_id=ZZTS53CJLJJGNTDJO0LEAYCWHVFO4DR4MVA2IOKNBDRPX1VK';
    url += '&client_secret=BQK22KCLX2TVVVMDDZZGZKSCOXWO054PG13PYKLPJI5QPBCC';
    url += '&sort=popular&limit=3&v=20170809';
    $.getJSON(url, function(data) {
        if (data.response.tips.items.length > 0) {
            var tip = data.response.tips.items[0];
            spot.fsReview().text(tip.text);
            spot.fsReview().url(tip.canonicalUrl);
            spot.fsReview().user().name(tip.user.firstName + ' ' + (tip.user.lastName || ''));
            spot.fsReview().user().picture(tip.user.photo.prefix + '30x30' + tip.user.photo.suffix);
        }
    }).fail(function() {
        spot.fsTipsFail(true);
    });
}

function getFsVenueDetails(spot) {
    // Gets additional information about the venue
    // (rating, url to foursquare page and opening hours)
    url = 'https://api.foursquare.com/v2/venues/' + spot.fsId;
    url += '?client_id=ZZTS53CJLJJGNTDJO0LEAYCWHVFO4DR4MVA2IOKNBDRPX1VK';
    url += '&client_secret=BQK22KCLX2TVVVMDDZZGZKSCOXWO054PG13PYKLPJI5QPBCC';
    url += '&v=20170809';
    $.getJSON(url, function(data) {
        venue = data.response.venue;
        spot.links.foursquare(venue.canonicalUrl);
        if (venue.rating) {
            spot.fsRating(venue.rating.toFixed(1));
        }
        if (venue.hours) {
            spot.hours(venue.hours);
        }
    }).fail(function() {
        spot.fsDetailsFail(true);
    });
}