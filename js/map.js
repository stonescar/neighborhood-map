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

function getFsVenueDetails(marker, callback) {
    url = 'https://api.foursquare.com/v2/venues/' + marker.fs_id;
    url += '?client_id=ZZTS53CJLJJGNTDJO0LEAYCWHVFO4DR4MVA2IOKNBDRPX1VK';
    url += '&client_secret=BQK22KCLX2TVVVMDDZZGZKSCOXWO054PG13PYKLPJI5QPBCC';
    url += '&v=20170809';
    $.getJSON(url, function(data) {
        venue = data.response.venue;
        marker.fs_url = venue.canonicalUrl;
        marker.fs_rating = venue.rating.toFixed(1);
        if (venue.hours) {
            marker.hours = venue.hours;
        }

        callback();
    }).fail(function (data) {
        console.log('failed');
        console.log(data);
    });
}

function getWiki(marker) {
    $.ajax({
        url: 'https://en.wikipedia.org/w/api.php?action=opensearch'+
             '&format=json&search=' + marker.title,
        dataType: "jsonp",
        success: function(data) {
            marker.wiki = data[3][0];
        }
    });
}

function getWeather() {
    var $w = $('#weather');
    if ($w.is(':empty')) {
        var url = 'http://api.openweathermap.org/data/2.5/forecast/daily?id=3133880' +
            '&appid=18749f71cbf50a133071442141f704eb&cnt=7&units=metric';
        $.getJSON(url, function (data) {
            for (var i = 0; i < data.list.length; i++) {
                var day = data.list[i];

                var date = new Date(day.dt*1000);
                var weekDay = getWeekDay(date);
                var fullDate = getFullDate(date);
                var temp = [Math.round(day.temp.min), Math.round(day.temp.max)];
                var weather = day.weather[0];

                $w.append('<div class="weather-day"><h5 title="' + fullDate + '">' + weekDay + '</h5>'+
                    '<img src="http://openweathermap.org/img/w/' + weather.icon + '.png" title="' +
                    weather.description + '"><span class="weather-temp" title="Min/max temperature (°C)">' + 
                    temp[0] + '° / ' + temp[1] + '°</div>');
            }

            function getWeekDay(date) {
                var weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
                    'Thursday', 'Friday', 'Saturday'];
                return weekDays[date.getDay()];
            }
            function getFullDate(date) {
                var day = date.getDate();
                var month = date.getMonth();
                var hour = date.getHours();
                preDay = getWeekDay(date).substring(0,3);
                var months = ['January', 'February', 'March', 'April', 'May', 'June',
                              'July', 'August', 'September', 'October', 'November', 'December'];
                return preDay + ' ' + day + '. ' + months[month] + ' @ ' + hour + ':00';
            }
        }).fail(function(data) {
            $w.text('Could not get weather data');
        });
    }
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
        getWiki(infoWindow.marker);
        getFlickr(infoWindow.marker, populateDomFlickr);
        getFsTips(infoWindow.marker, populateDomFsTip);
        getFsVenueDetails(infoWindow.marker, populateDomFsVenueDetails);
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
            $('#picture-reel').append('<img src="' + marker.flickr[i].url + '" title="' +
                marker.flickr[i].title + ' by ' + marker.flickr[i].photographer + '">');
        }
    }
    function populateDomFsVenueDetails() {
        var marker = my.viewModel.activeSpot().marker();
        // Add rating
        if (marker.fs_rating) {
            $('#fs-rating').prepend(marker.fs_rating).show();
        }
        // Add address + phone
        $('#fs-info').html('<h4>Details about ' + marker.title +
            '</h4><div class="row" id="fs-info-cont"></div>');
        $('#fs-info-cont').append('<div class="col-xs-4" id="address-col"><h5>Address:</h5>' +
            '<address id="fs-address"><strong>' + 
            marker.address[0] + '</strong><br>' + 
            marker.address[1] + '<br>' + 
            marker.address[2] + '</address></div>');
        if (marker.phone) {
            $('#fs-address').append('<br>Tel: ' + marker.phone);
        }
        // Add opening hours
        if (marker.hours) {
            $('#fs-info-cont').append('<div class="col-xs-4" id="hours-col"><h5>Opening hours</h5>' +
                '<dl id="hours"></dl></div>');
            for (var i = 0; i < marker.hours.timeframes.length; i++) {
                var time = marker.hours.timeframes[i];
                $('#hours').append('<dt>' + time.days + '</dt><dd>' + time.open[0].renderedTime + '</dd>');
            }
        }
        // Add links
        $('#fs-info-cont').append('<div class="col-xs-4" id="links"><h5>Links</h5></div>');
        if (marker.webpage) {
            $('#links').append('<a href="' + marker.webpage +
                '" class="btn btn-primary btn-xs btn-block" target="new">Webpage</a>');
        }
        $('#links').append('<a href="' + marker.fs_url +
            '" class="btn btn-danger btn-xs btn-block" target="new">Foursquare page</a>');
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
    }
}