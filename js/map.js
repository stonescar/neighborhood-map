var map;
var infoWindow;
var markers = [];

function initMap() {
    // Initialize map
    map = new google.maps.Map(document.getElementById('map'), {
        mapTypeControl: false,
        // Hide place labels
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

function populateInfoWindow(marker, infowindow) {
    // Add content to info windows
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
            // Adds content to the infowindow element
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
    // Animate marker
    marker.setAnimation(google.maps.Animation.BOUNCE);
    // Make sure the correct active marker is set to highligh it in item list
    if (my.viewModel.activeSpot() != my.viewModel.getSpotById(marker.id)) {
        my.viewModel.setActiveFromMarker(marker.id);
    }
    // Stop animation and open info window
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