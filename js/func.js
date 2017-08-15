// Page functionality functions

//Clear active spot when closing modal
$(document).on('hide.bs.modal', '#infoModal', function() {
    my.viewModel.clearActiveSpot();
    // Clear dynamic DOM elements
    $('#flickr').html('');
    $('#fs-review').html('');
});

// When resizing window, collapse menu if width < 768
$(window).on('resize', function() {
    collapseOnMobile();
});

// When document is loaded
$(document).ready(function() {
    collapseOnMobile()
    // Initialize perfect scrollbar on list group
    $('.list-group').perfectScrollbar({suppressScrollX: true, wheelSpeed: 0.5});
});

function collapseOnMobile() {
    // Collapse menu if width < 768
    if ($(window).width() < 768) {
        $('#spots-menu').collapse('hide');
    } else {
        $('#spots-menu').collapse('show');
    }
}

function openModal() {
    // If information has not been fetched before, call ajax functions
    // Then, populate and show modal
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
}

function showModal() {
    // Hide infowindow
    infoWindow.setMap(null);
    infoWindow.marker = null;
    // Make sure the marker is stored on the active `spot` object
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
    // Adds Foursquare tip content to the modal
    var marker = my.viewModel.activeSpot().marker();
    if (marker.fsReview) {
        $('#fs-review').html('<h4>Top tip from Foursquare</h4><blockquote class="blockquote-reverse">' +
            marker.fsReview.text + '<footer><img src="' + marker.fsReview.user.picture +
            '"><a href="' + marker.fsReview.url + '" target="new">' + marker.fsReview.user.name +
            '</a></footer></blockquote>');
    }
}
function populateDomFlickr() {
    // Adds flickr photos to the picture reel
    var marker = my.viewModel.activeSpot().marker();
    if (marker.flickr) {
        $('#flickr').html('<h4>Pictures from flickr</h4><div id="picture-reel"></div>');
        for (var i = 0; i < marker.flickr.length; i++) {
            $('#picture-reel').append('<img src="' + marker.flickr[i].url + '" title="' +
                marker.flickr[i].title + ' by ' + marker.flickr[i].photographer + '">');
        }
    } else {
        // If there are no photos, hide the `#flickr` element
        $('#flickr').hide();
    }
}

function populateDomFsVenueDetails() {
    // Adds foursquare details to the modal
    var marker = my.viewModel.activeSpot().marker();
    // Add rating, if any
    if (marker.fs_id) {
        if (marker.fs_rating) {
            $('#fs-rating').prepend(marker.fs_rating).show();
        } else {
            // Hide rating element if no rating
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
        if (marker.webpage) { // Venue's homepage
            $('#links').append('<a href="' + marker.webpage +
                '" class="btn btn-primary btn-xs btn-block" target="new">Webpage</a>');
        }
        if (marker.fs_url) { // Venues foursquare page
            $('#links').append('<a href="' + marker.fs_url +
                '" class="btn btn-danger btn-xs btn-block" target="new">Foursquare page</a>');
        }
        if (marker.social.facebook) { // Facebook page
            $('#links').append('<a href="http://facebook.com/' + marker.social.facebook +
                '" class="btn btn-info btn-xs btn-block" target="new">Facebook page</a>');
        }
        if (marker.social.twitter) { // Twitter profile
            $('#links').append('<a href="http://twitter.com/' + marker.social.twitter +
                '" class="btn btn-info btn-xs btn-block" target="new">Twitter</a>');
        }
        // flickr page
        $('#links').append('<a href="https://www.flickr.com/search/?text=' + marker.title +
            '" class="btn btn-success btn-xs btn-block" target="new">flickr</a>');
        if (marker.wiki) { // Wikipedia page
            $('#links').append('<a href="' + marker.wiki +
                '" class="btn btn-warning btn-xs btn-block" target="new">Wikipedia</a>');
        }

    } else {
        // Display error message if info could not be found
        $('#fs-info').html('<h4 class="text-center">Could not get information from Foursquare</h4>');
    }
}