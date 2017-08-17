var Spot = function(data, id) {
    this.name = ko.observable(data.name);
    this.location = data.location;
    this.id = id;
    this.marker;
    this.fsId;
    this.address = ko.observableArray([]);
    this.phone = ko.observable();
    this.category = ko.observable();
    this.links = {
        website: ko.observable(),
        facebook: ko.observable(),
        twitter: ko.observable(),
        foursquare: ko.observable(),
        flickr: ko.observable('https://www.flickr.com/search/?text=' + data.name),
        wikipedia: ko.observable()
    };
    this.fsReview = ko.observable({
        text: ko.observable(),
        user: ko.observable({
            name: ko.observable(),
            picture: ko.observable()
        }),
        url: ko.observable(),
    });
    this.fsRating = ko.observable();
    this.hours = ko.observable();
    this.flickr = ko.observableArray([]);
    this.fsStatus = ko.observable(null);
    this.flickrStatus = ko.observable(null);
};


var Weather = function(date, minTemp, maxTemp, description, icon) {
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
};


var ViewModel = function() {
    var self = this;
    this.spotList = ko.observableArray([]);
    this.activeSpot = ko.observable(null);
    this.filterQuery = ko.observable('');
    this.weatherForecast = ko.observableArray([]);

    // Create spots from `spots.js`
    for (var i = 0; i < spots.length; i++) {
        newSpot = new Spot(spots[i], i);
        self.spotList.push(newSpot);
    }


    this.setActiveSpot = function(spot) {
        self.activeSpot(spot);
        openInfoWindow(spot.marker);
        collapseOnMobile();
    };

    this.clearActiveSpot = function() {
        self.activeSpot(null);
    };

    this.setActiveFromMarker = function(id) {
        // Set correct spot as active when clicking a marker
        spot = self.getSpotById(id);
        self.activeSpot(spot);
    };

    this.getSpotById = function(id) {
        return self.spotList()[id];
    };

    this.match = function(spot) {
        // if (spot.marker) {
            // Checks to see if spot name matches filter query and shows/hides map markers accordingly
            lo_name = spot.name().toLowerCase();
            lo_query = self.filterQuery().toLowerCase();
            if (lo_name.includes(lo_query) || lo_query === '') {
                if (spot.marker) {
                    showMarker(spot.marker);
                }
                return true;
            } else {
                if (spot.marker) {
                    hideMarker(spot.marker);
                }
            }
    };

    this.clearFilter = function() {
        self.filterQuery('');
    };
};

// This makes attributes and methods accessible outside the
// ViewModel, using the `my.ViewModel` name space
var my = {};
my.ViewModel = new ViewModel();

// Apply knockout bindings
ko.applyBindings(my.ViewModel);