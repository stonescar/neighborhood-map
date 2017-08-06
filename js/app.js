var Spot = function(data) {
    this.name = ko.observable(data.name);
}


var viewModel = function() {
    var self = this;
    this.spotList = ko.observableArray([]);
    this.activeSpot = ko.observable();

    spots.forEach(function(spot) { // `spots` imported from `spots.js`
        self.spotList.push(new Spot(spot));
    });


    this.setActiveSpot = function(spot) {
        self.activeSpot(spot);
    }
}

ko.applyBindings(new viewModel());