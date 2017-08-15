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