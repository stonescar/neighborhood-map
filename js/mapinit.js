var map;
var infoWindow;

function initMap() {
    // Initialize map
    map = new google.maps.Map(document.getElementById('map'), {
        mapTypeControl: false,
        // Hide place labels
        styles: [{"featureType": "poi", "elementType": "labels", "stylers":[{"visibility": "off"}]}]
    });
    
    var bounds = new google.maps.LatLngBounds();

    infoWindow = new google.maps.InfoWindow();
    var spotList = my.ViewModel.spotList();

    // Add markers to ViewModel's `spotList`
    for (var i = 0; i < spotList.length; i++) {

        var marker = new google.maps.Marker({
            id: i,
            position: spots[i].location,
            animation: google.maps.Animation.DROP
        });

        bounds.extend(marker.position);
        marker.setMap(map);
        spotList[i].marker = marker;

        marker.addListener('click', function() {
            openInfoWindow(this);
        });
    }

    map.fitBounds(bounds);
}