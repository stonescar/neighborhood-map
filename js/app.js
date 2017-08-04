var Spot = function(data) {
    this.name = ko.observable(data.name);
}


var viewModel = function() {
    var self = this;
    this.spotList = ko.observableArray([]);

    spots.forEach(function(spot) { // `spots` imported from `spots.js`
        self.spotList.push(new Spot(spot));
    });
}

ko.applyBindings(new viewModel());