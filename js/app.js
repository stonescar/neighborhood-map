var Spot = function(data, id, marker) {
    this.name = ko.observable(data.name);
    this.id = id;
    this.marker = ko.observable(marker);
}

var my = {};

var viewModel = function() {
    var self = this;
    this.spotList = ko.observableArray([]);
    this.activeSpot = ko.observable(null);
    this.filterQuery = ko.observable('');

    for (var i = 0; i < spots.length; i++) {
        newSpot = new Spot(spots[i], i, markers[i]);
        self.spotList.push(newSpot);
    }


    this.setActiveSpot = function(spot) {
        self.activeSpot(spot);
        openInfoWindow(markers[spot.id]);
    }

    this.clearActiveSpot = function() {
        self.activeSpot(null);
    }

    this.setActiveFromMarker = function(id) {
        spot = self.getSpotById(id);
        self.activeSpot(spot);
    }

    this.getSpotById = function(id) {
        return self.spotList()[id];
    }

    this.match = function(spot) {
        lo_name = spot.name().toLowerCase();
        lo_query = self.filterQuery().toLowerCase();
        if (lo_name.includes(lo_query) || lo_query == '') {
            showMarker(spot.id);
            return true;
        } else {
            hideMarker(spot.id);
        }
    }

    this.clearFilter = function() {
        self.filterQuery('');
    }
}

$(document).on('hide.bs.modal', '#infoModal', function() {
        my.viewModel.clearActiveSpot();
        // Clear dynamic DOM elements
        $('#flickr').html('');
        $('#fs-review').html('');
});

// This makes attributes and methods accessible outside the
// viewModel, using the `my.viewModel` name space
my.viewModel = new viewModel();
ko.applyBindings(my.viewModel);