var map;
var infoWindow;
var markers = [];

// Initialize map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        mapTypeControl: false,
        styles: [{"featureType": "poi", "elementType": "labels", "stylers":[{"visibility": "off"}]}]
    });
    
    var bounds = new google.maps.LatLngBounds();

    infoWindow = new google.maps.InfoWindow();

    // Make markers from `spots` in `spots.js`
    for (var i = 0; i < spots.length; i++) {
        var position = spots[i].location;
        var title = spots[i].name;

        var marker = new google.maps.Marker({
            id: i,
            title: title,
            position: position,
            animation: google.maps.Animation.DROP
        });

        bounds.extend(position);
        marker.setMap(map);
        markers.push(marker);

        marker.addListener('click', function() {
            openInfoWindow(this);
        });
    }

    map.fitBounds(bounds);
}


// Add content to info windows
function populateInfoWindow(marker, infowindow) {
    if (infowindow.marker != marker) {
        infowindow.setContent('');
        infowindow.marker = marker;
        infowindow.setContent('<h4>' + marker.title + '</h4><p>Fetching details...</p>');
        if (!marker.fs_id) {
            getFsVenue(marker, setWindowContent);
        } else {
            setWindowContent();
        }

        function setWindowContent() {
            var content = '<h4>' + marker.title + '<br><small>' + marker.category + '</small></h4>';
            content += '<address><strong>' + marker.title + '</strong><br>';
            content += marker.address[0] + '<br>' + marker.address[1];
            if (marker.phone) {
                content += '<br>Tel: ' + marker.phone;
            }
            if (marker.webpage) {
                content += '<br><a href="' + marker.webpage + '" target="new">' + marker.webpage + '</a>';
            }
            content += '</address>';
            content += '<button class="btn btn-sm btn-primary" onclick="openModal()">More info...</button>';
            
            
            infowindow.setContent(content);
            // Make map adjust to fit infowindow
            infowindow.open(map, marker);
        }

        infowindow.open(map, marker);
        
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
            my.viewModel.clearActiveSpot();
        });
    }
}

function openInfoWindow(marker) {
    infoWindow.setMap(null);
    marker.setAnimation(google.maps.Animation.BOUNCE);
    if (my.viewModel.activeSpot() != my.viewModel.getSpotById(marker.id)) {
        my.viewModel.setActiveFromMarker(marker.id);
    }
    window.setTimeout(function() {
        marker.setAnimation(null);
        populateInfoWindow(marker, infoWindow);
    }, 700);
}

function getFsVenue(marker, callback) {
    var query = marker.title;
    var ll = marker.getPosition().lat() + ',' + marker.getPosition().lng();
    var url = 'https://api.foursquare.com/v2/venues/search?';
    url += 'll=' + ll;
    url += '&query=' + query;
    url += '&client_id=ZZTS53CJLJJGNTDJO0LEAYCWHVFO4DR4MVA2IOKNBDRPX1VK';
    url += '&client_secret=BQK22KCLX2TVVVMDDZZGZKSCOXWO054PG13PYKLPJI5QPBCC';
    url += '&v=20170808';
    $.getJSON(url, function(data) {
        for (var i = 0; i < data.response.venues.length; i++) {
            if (data.response.venues[i].name == query) {
                var venue = data.response.venues[i];
                break;                
            }
        }
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
        infoWindow.setContent('<h4>' + query + '</h4><p>Could not get details for ' + query + '</p>');
    });
}

function getFsTips(marker, callback) {
    url = 'https://api.foursquare.com/v2/venues/' + marker.fs_id + '/tips';
    url += '?client_id=ZZTS53CJLJJGNTDJO0LEAYCWHVFO4DR4MVA2IOKNBDRPX1VK';
    url += '&client_secret=BQK22KCLX2TVVVMDDZZGZKSCOXWO054PG13PYKLPJI5QPBCC';
    url += '&sort=popular&limit=3&v=20170809';
    $.getJSON(url, function(data) {
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
    }).fail(function(data) {
        console.log('Tips request failed');
        console.log(data);
        marker.fsTipsFailed = true;
    });
}

function getFlickr(marker, callback) {
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
    });
}

function showMarker(id) {
    if (markers[0]) {
        markers[id].setMap(map);
    }
}

function hideMarker(id) {
    markers[id].setMap(null);
}

function openModal() {
    if (!infoWindow.marker.fsReview) {
        getFlickr(infoWindow.marker, populateDomFlickr);
        getFsTips(infoWindow.marker, populateDomFsTip);
    } else {
        populateDomFlickr()
        populateDomFsTip();
    }
    showModal();

    function showModal() {
        infoWindow.setMap(null);
        infoWindow.marker = null;
        if (!my.viewModel.activeSpot().marker()) {
            my.viewModel.activeSpot().marker(markers[my.viewModel.activeSpot().id]);
        }
        $('#infoModal').modal('show');
    }
    function populateDomFsTip() {
        var marker = my.viewModel.activeSpot().marker();
        $('#fs-review').html('<h4>Top tip from Foursquare</h4><blockquote class="blockquote-reverse">' +
            marker.fsReview.text + '<footer><img src="' + marker.fsReview.user.picture +
            '"><a href="' + marker.fsReview.url + '" target="new">' + marker.fsReview.user.name +
            '</a></footer></blockquote>');
    }
    function populateDomFlickr() {
        var marker = my.viewModel.activeSpot().marker();
        $('#flickr').html('<h4>Pictures from flickr</h4><div id="picture-reel"></div>');
        for (var i = 0; i < marker.flickr.length; i++) {
            $('#picture-reel').append('<img src="' + marker.flickr[i].url + '" title="' + marker.flickr[i].title + ' by ' + marker.flickr[i].photographer + '">');
        }
    }
}