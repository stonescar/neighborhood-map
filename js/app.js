var Spot = function(data, id, marker) {
    this.name = ko.observable(data.name);
    this.id = id;
    this.marker = ko.observable(marker);
}


var viewModel = function() {
    var self = this;
    this.spotList = ko.observableArray([]);
    this.activeSpot = ko.observable(null);
    this.filterQuery = ko.observable('');

    // Create spots from `spots.js`
    for (var i = 0; i < spots.length; i++) {
        newSpot = new Spot(spots[i], i, markers[i]);
        self.spotList.push(newSpot);
    }


    this.setActiveSpot = function(spot) {
        self.activeSpot(spot);
        openInfoWindow(markers[spot.id]);
        collapseOnMobile();
    }

    this.clearActiveSpot = function() {
        self.activeSpot(null);
    }

    this.setActiveFromMarker = function(id) {
        // Set correct spot as activ when clicking a marker
        spot = self.getSpotById(id);
        self.activeSpot(spot);
    }

    this.getSpotById = function(id) {
        return self.spotList()[id];
    }

    this.match = function(spot) {
        // Checks to see if spot name matches filter query and shows/hides map markers accordingly
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

// This makes attributes and methods accessible outside the
// viewModel, using the `my.viewModel` name space
var my = {};
my.viewModel = new viewModel();

// Apply knockout bindings
ko.applyBindings(my.viewModel);