// Page functionality functions

//Clear active spot when closing modal
$(document).on('hide.bs.modal', '#infoModal', function() {
    my.ViewModel.clearActiveSpot();
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

    // Clear filter on esc key
    $('#filter-text').keypress(function(e) {
        if (e.keyCode == 27) {
            my.ViewModel.clearFilter();
        }
    })
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
    // Then, show modal
    var spot = my.ViewModel.activeSpot();
    if (!spot.detailed) {
        getFlickr(spot);
        getFsVenueDetails(spot);
        getFsTips(spot);
        getWiki(spot);
        spot.detailed = true;
    }
    showModal();
}

function showModal() {
    // Hide infowindow
    infoWindow.setMap(null);
    infoWindow.marker = null;
    $('#infoModal').modal('show');
    // Make sure pictures are loaded before initializing scroll bar
    window.setTimeout(function() {
        $('#picture-reel').perfectScrollbar({suppressScrollY: true,
                                             useBothWheelAxes: true,
                                             wheelSpeed: 0.5});
    }, 1000);
}