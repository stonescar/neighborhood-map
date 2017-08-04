var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 63.431915, lng: 10.395053},
        zoom: 13,
        mapTypeControl: false
    })
}
