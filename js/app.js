var Spot = function(data, id, marker) {
    this.name = ko.observable(data.name);
    this.id = id;
    this.marker = ko.observable(marker);
}


var Weather = function(date, minTemp, maxTemp, description, icon) {
    // var self = this;
    this.date = ko.observable(new Date(date));
    this.minTemp = ko.observable(Math.round(minTemp));
    this.maxTemp = ko.observable(Math.round(maxTemp));
    this.description = ko.observable(description);
    this.icon = ko.observable(icon);
    this.weekDay = ko.computed(function() {
        // Takes a `Date` object and returns the weekday name
        var weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
            'Thursday', 'Friday', 'Saturday'];
        return weekDays[this.date().getDay()];
    }, this);
    this.fullDate = ko.computed(function() {
        // Takes a `Date` object and returns a formatted date string
        // Format example: "Tue 15. August @ 11:00"
        var day = this.date().getDate();
        var month = this.date().getMonth();
        var hour = this.date().getHours();
        var preDay = this.weekDay().substring(0,3);
        var months = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
        return preDay + ' ' + day + '. ' + months[month] + ' @ ' + hour + ':00';
    }, this);
}


var viewModel = function() {
    var self = this;
    this.spotList = ko.observableArray([]);
    this.activeSpot = ko.observable(null);
    this.filterQuery = ko.observable('');
    this.weatherForecast = ko.observableArray([]);

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