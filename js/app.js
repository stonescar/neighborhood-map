var Spot = function(data) {
    this.name = ko.observable(data.name);
}

var my = {};

var viewModel = function() {
    var self = this;
    this.spotList = ko.observableArray([]);
    this.activeSpot = ko.observable();
    this.filterQuery = ko.observable('');

    for (var i = 0; i < spots.length; i++) {
        newSpot = new Spot(spots[i]);
        newSpot.id = i;
        self.spotList.push(newSpot);
    }


    this.setActiveSpot = function(spot) {
        self.activeSpot(spot);
        populateInfoWindow(markers[spot.id], infoWindow);
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
}

// This makes attributes and methods accessible outside the
// viewModel, using the `my.viewModel` name space
my.viewModel = new viewModel();
ko.applyBindings(my.viewModel);