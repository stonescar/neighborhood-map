var map;
var markers = [];

// Initialize map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        mapTypeControl: false,
        styles: [{"featureType": "poi", "elementType": "labels", "stylers":[{"visibility": "off"}]}]
    });
    
    var bounds = new google.maps.LatLngBounds();

    var infoWindow = new google.maps.InfoWindow();

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
            populateInfoWindow(this, infoWindow);
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
        if (!marker.place_id) {
            getPlaceDetails(marker, setWindowContent);
        } else {
            setWindowContent();
        }

        function setWindowContent() {
            var content = '<h4>' + marker.title + '</h4>';
            if (marker.rating) {
                content += '<div class="rating"><span class="glyphicon glyphicon-star"></span>' + marker.rating + '</div>';
            }
            content += '<div class="container><div class="row"><div class="col-sm-6">'
            if (marker.picture) {
                content += '<img class="spot-image" src="' + marker.picture + '">';
            }
            content += '</div><div class="col-sm-6">'
            content += '<div class="contact"><h5>Contact</h5>';
            if (marker.phone) {
                content += '<span class="phone">' + marker.phone + '</span><br>';
            }
            if (marker.full_address) {
                content += '<span class="address">' + marker.full_address + '</span>';
            }
            content += '</div>';
            if (marker.review) {
                content += '<blockquote class="review"><p>' + marker.review.text + '</p>';
                content += '<footer>' + marker.review.user + '</footer></blockquote>';
            }
            content += '</div></div></div>'
            infowindow.setContent(content);
        }

        infowindow.open(map, marker);
        
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
    }
}

function getPlaceDetails(marker, callback) {
    // Get place ID
    var placesService = new google.maps.places.PlacesService(map);
    placesService.textSearch({
        query: marker.title,
        bounds: map.getBounds()
    }, function(result, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            marker.place_id = result[0].place_id;

            // Get place details
            placesService.getDetails({
                placeId: marker.place_id
            }, function(place, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    marker.address = place.formatted_address.split(', ');
                    marker.full_address = marker.address[0] + '<br>' + marker.address[1];
                    marker.phone = place.international_phone_number;
                    // Make sure that picture is in landscape mode and 4:3 or wider
                    for (var i = 0; i < place.photos.length; i++) {
                        if (place.photos[i].width / place.photos[i].height > 1.3) {
                            marker.picture = place.photos[i].getUrl({maxHeight: 300, maxWidth: 400});
                            break;
                        }
                    }
                    // If no pictures in landscape, use first picture
                    if (!marker.picture) {
                        marker.picture = place.photos[0].getUrl({maxHeight: 300, maxWidth: 400});
                    }
                    marker.rating = place.rating;
                    if (place.reviews) {
                        // Find a short (< 160 charachters) review
                        for (var i = 0; i < place.reviews.length; i++) {
                            if (place.reviews[i].text.length < 160) {
                                marker.review = {
                                    user: place.reviews[i].author_name,
                                    text: place.reviews[i].text
                                };
                                break;
                            }
                        }
                        // Fallback if no reviews were < 160 charachters
                        if (!marker.review) {
                            marker.review = {
                                    user: place.reviews[0].author_name,
                                    text: place.reviews[0].text
                            };
                        }
                    }
                    callback();
                } else {
                    console.log(status);
                }
            });
        } else {
            console.log(status);
        }
    });
}