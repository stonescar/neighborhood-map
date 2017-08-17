function populateInfoWindow(spot, infowindow) {
    var marker = spot.marker;
    // Add content to info windows
    if (infowindow.marker != marker) {
        infowindow.setContent('');
        infowindow.marker = marker;
        infowindow.setContent('<h4>' + spot.name() + '</h4><p>Fetching details...</p>');
        setWindowContent();
        

        function setWindowContent() {
            // Adds content to the infowindow element
            if (spot.fsStatus() == 'success') {
                var content = '<h4>' + spot.name() + '<br><small>' + spot.category() + '</small></h4>';
                content += '<address><strong>' + spot.name() + '</strong>';
                for (var i = 0; i < spot.address().length - 1; i++) {
                    content += '<span>' + spot.address()[i] + '</span>';
                }
                if (spot.phone()) {
                    content += '<span>Tel: ' + spot.phone() + '</span>';
                }
                if (spot.links.website()) {
                    content += '<a href="' + spot.links.website() + '" target="new">' +
                    spot.links.website() + '</a>';
                }
                content += '</address>';
                content += '<button class="btn btn-sm btn-primary"' + 
                    'onclick="openModal()">More info...</button>';
                
                infowindow.setContent(content);

            } else if (spot.fsStatus() == 'fail') {
                // If request failed
                infoWindow.setContent('<h4>' + spot.name() + '</h4><p>Could not get details for ' +
                    spot.name() + '</p><button class="btn btn-sm btn-primary" onclick="openModal()">' +
                    'More info...</button>');
            }
            
            // Make map adjust to fit infowindow
            infowindow.open(map, marker);
        }

        infowindow.open(map, marker);
        
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
            my.ViewModel.clearActiveSpot();
        });
    }
}

function openInfoWindow(marker) {
    var spot = my.ViewModel.getSpotById(marker.id);
    if (!spot.fsId) {
        getFsVenue(spot);
    }
    infoWindow.setMap(null);
    // Animate marker
    marker.setAnimation(google.maps.Animation.BOUNCE);
    // Make sure the correct active marker is set to highligh it in item list
    if (my.ViewModel.activeSpot() != my.ViewModel.getSpotById(marker.id)) {
        my.ViewModel.setActiveFromMarker(marker.id);
    }
    // Stop animation and open info window
    window.setTimeout(function() {
        marker.setAnimation(null);
        populateInfoWindow(spot, infoWindow);
    }, 700);
}

function showMarker(marker) {
    marker.setVisible(true);
}

function hideMarker(marker) {
    marker.setVisible(false);
}