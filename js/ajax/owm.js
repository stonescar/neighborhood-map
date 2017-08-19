function getWeather() {
    // Gets weather data for the next 7 days from Trondheim from OpenWeatherMap.org
    var $w = $('#weather');
    // Only get data if not requested before
    if (my.ViewModel.weatherForecast().length == 0) {
        var url = 'http://api.openweathermap.org/data/2.5/forecast/daily?id=3133880' +
            '&appid=18749f71cbf50a133071442141f704eb&cnt=7&units=metric';
        $.getJSON(url, function (data) {
            for (var i = 0; i < data.list.length; i++) {
                var day = data.list[i];

                my.ViewModel.weatherForecast.push(
                    new Weather(day.dt*1000,
                                day.temp.min,
                                day.temp.max,
                                day.weather[0].description,
                                day.weather[0].icon));
            }
            

            // Make sure data is loaded before initializing scroll bar
            window.setTimeout(function() {
                $('#weather').perfectScrollbar({suppressScrollY: true,
                                                     useBothWheelAxes: true,
                                                     wheelSpeed: 0.5});
            }, 1000);
        }).fail(function() {
            my.ViewModel.weatherFail(true);
        });
    }
}