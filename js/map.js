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
            getPlaceDetails(marker, setWindowContent);
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
            content += '<button class="btn btn-sm btn-primary>More info...</button>';
            
            
            infowindow.setContent(content);
            // Make map adjust to fit infowindow
            infowindow.open(map, marker);
        }

        infowindow.open(map, marker);
        
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
            my.viewModel.activeSpot(null);
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

function getPlaceDetails(marker, callback) {
    var query = marker.title;
    var ll = marker.getPosition().lat() + ',' + marker.getPosition().lng();
    var url = 'https://api.foursquare.com/v2/venues/search?';
    url += 'll=' + ll;
    url += '&query=' + query;
    url += '&client_id=ZZTS53CJLJJGNTDJO0LEAYCWHVFO4DR4MVA2IOKNBDRPX1VK';
    url += '&client_secret=BQK22KCLX2TVVVMDDZZGZKSCOXWO054PG13PYKLPJI5QPBCC';
    url += '&v=20170808';
    $.getJSON(url, function(data) {
        console.log(data);
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
        console.log(marker);
        callback();
    }).fail(function() {
        infoWindow.setContent('<h4>' + query + '</h4><p>Could not get details for ' + query + '</p>');
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