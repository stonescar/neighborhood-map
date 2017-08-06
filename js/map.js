var map;
var markers = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 63.431915, lng: 10.395053},
        zoom: 8,
        mapTypeControl: false,
        styles: [{"featureType": "poi", "elementType": "labels", "stylers":[{"visibility": "off"}]}]
    });
    
    var bounds = new google.maps.LatLngBounds();

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
    }

    map.fitBounds(bounds);
}
