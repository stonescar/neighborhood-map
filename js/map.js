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
            content += '<address><strong>' + marker.title + '</strong>';
            for (var i = 0; i < marker.address.length - 1; i++) {
                content += '<br>' + marker.address[i];
            }
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

function showMarker(id) {
    if (markers[0]) {
        markers[id].setMap(map);
    }
}

function hideMarker(id) {
    markers[id].setMap(null);
}

function openModal() {
    if (!infoWindow.marker.detailed) {
        getWiki(infoWindow.marker);
        getFlickr(infoWindow.marker, populateDomFlickr);
        getFsTips(infoWindow.marker, populateDomFsTip);
        getFsVenueDetails(infoWindow.marker, populateDomFsVenueDetails);
        infoWindow.marker.detailed = true;
    } else {
        populateDomFlickr()
        populateDomFsTip();
        populateDomFsVenueDetails();
    }
    showModal();

    function showModal() {
        infoWindow.setMap(null);
        infoWindow.marker = null;
        if (!my.viewModel.activeSpot().marker()) {
            my.viewModel.activeSpot().marker(markers[my.viewModel.activeSpot().id]);
        }
        $('#infoModal').modal('show');
        // Make sure pictures are loaded before initializing scroll bar
        window.setTimeout(function() {
            $('#picture-reel').perfectScrollbar({suppressScrollY: true,
                                                 useBothWheelAxes: true,
                                                 wheelSpeed: 0.5});
        }, 1000);
    }
    function populateDomFsTip() {
        var marker = my.viewModel.activeSpot().marker();
        if (marker.fsReview) {
            $('#fs-review').html('<h4>Top tip from Foursquare</h4><blockquote class="blockquote-reverse">' +
                marker.fsReview.text + '<footer><img src="' + marker.fsReview.user.picture +
                '"><a href="' + marker.fsReview.url + '" target="new">' + marker.fsReview.user.name +
                '</a></footer></blockquote>');
        }
    }
    function populateDomFlickr() {
        var marker = my.viewModel.activeSpot().marker();
        if (marker.flickr) {
            $('#flickr').html('<h4>Pictures from flickr</h4><div id="picture-reel"></div>');
            for (var i = 0; i < marker.flickr.length; i++) {
                $('#picture-reel').append('<img src="' + marker.flickr[i].url + '" title="' +
                    marker.flickr[i].title + ' by ' + marker.flickr[i].photographer + '">');
            }
        } else {
            $('#flickr').hide();
        }
    }
    
    function populateDomFsVenueDetails() {
        var marker = my.viewModel.activeSpot().marker();
        // Add rating
        if (marker.fs_id) {
            if (marker.fs_rating) {
                $('#fs-rating').prepend(marker.fs_rating).show();
            } else {
                $('#fs-rating').hide();
            }
            // Add address + phone
            $('#fs-info').html('<h4>Details about ' + marker.title +
                '</h4><div class="row" id="fs-info-cont"></div>');
            var addr = '<div class="col-xs-4" id="address-col"><h5>Address:</h5>' +
                '<address id="fs-address"><strong>' + marker.address[0] + '</strong>';
            for (var i = 1; i < marker.address.length - 1; i++) {
                addr += '<br>' + marker.address[i];
            }
            if (marker.phone) {
                addr += '<br>Tel: ' + marker.phone;
            }
            addr += '</address>';
            $('#fs-info-cont').html(addr);
            // Add opening hours
            if (marker.hours) {
                $('#fs-info-cont').append('<div class="col-xs-4" id="hours-col"><h5>Opening hours</h5>' +
                    '<dl id="hours"></dl></div>');
                for (var i = 0; i < marker.hours.timeframes.length; i++) {
                    var time = marker.hours.timeframes[i];
                    $('#hours').append('<dt>' + time.days + '</dt><dd>' +
                        time.open[0].renderedTime + '</dd>');
                }
            }
            // Add links
            $('#fs-info-cont').append('<div class="col-xs-4" id="links"><h5>Links</h5></div>');
            if (marker.webpage) {
                $('#links').append('<a href="' + marker.webpage +
                    '" class="btn btn-primary btn-xs btn-block" target="new">Webpage</a>');
            }
            if (marker.fs_url) {
                $('#links').append('<a href="' + marker.fs_url +
                    '" class="btn btn-danger btn-xs btn-block" target="new">Foursquare page</a>');
            }
            if (marker.social.facebook) {   
                $('#links').append('<a href="http://facebook.com/' + marker.social.facebook +
                    '" class="btn btn-info btn-xs btn-block" target="new">Facebook page</a>');
            }
            if (marker.social.twitter) {
                $('#links').append('<a href="http://twitter.com/' + marker.social.twitter +
                    '" class="btn btn-info btn-xs btn-block" target="new">Twitter</a>');
            }
            $('#links').append('<a href="https://www.flickr.com/search/?text=' + marker.title +
                '" class="btn btn-success btn-xs btn-block" target="new">flickr</a>');
            if (marker.wiki) {
                $('#links').append('<a href="' + marker.wiki +
                    '" class="btn btn-warning btn-xs btn-block" target="new">Wikipedia</a>');
            }
        } else {
            console.log(marker.fs_id);
            $('#fs-info').html('<h4 class="text-center">Could not get information from Foursquare</h4>');
        }
    }
}