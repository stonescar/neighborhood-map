function getWeather() {
    // Gets weather data for the next 7 days from Trondheim from OpenWeatherMap.org
    var $w = $('#weather');
    // Only get data if not requested before
    if ($w.is(':empty')) {
        var url = 'http://api.openweathermap.org/data/2.5/forecast/daily?id=3133880' +
            '&appid=18749f71cbf50a133071442141f704eb&cnt=7&units=metric';
        $.getJSON(url, function (data) {
            for (var i = 0; i < data.list.length; i++) {
                var day = data.list[i];

                var date = new Date(day.dt*1000);
                var weekDay = getWeekDay(date);
                var fullDate = getFullDate(date);
                var temp = [Math.round(day.temp.min), Math.round(day.temp.max)];
                var weather = day.weather[0];

                $w.append('<div class="weather-day"><h5 title="' + fullDate + '">' + weekDay + '</h5>'+
                    '<img src="http://openweathermap.org/img/w/' + weather.icon + '.png" title="' +
                    weather.description + '"><span class="weather-temp" title="Min/max temperature (°C)">' + 
                    temp[0] + '° / ' + temp[1] + '°</div>');
            }

            // Initializes perfect scrollbar on weather element
            $('#weather').perfectScrollbar({suppressScrollY: true, useBothWheelAxes: true, wheelSpeed: 0.5});

            function getWeekDay(date) {
                // Takes a `Date` object and returns the weekday name
                var weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
                    'Thursday', 'Friday', 'Saturday'];
                return weekDays[date.getDay()];
            }

            function getFullDate(date) {
                // Takes a `Date` object and returns a formatted date string
                // Format example: "Tue 15. August @ 11:00"
                var day = date.getDate();
                var month = date.getMonth();
                var hour = date.getHours();
                preDay = getWeekDay(date).substring(0,3);
                var months = ['January', 'February', 'March', 'April', 'May', 'June',
                              'July', 'August', 'September', 'October', 'November', 'December'];
                return preDay + ' ' + day + '. ' + months[month] + ' @ ' + hour + ':00';
            }
        }).fail(function(data) {
            $w.html('<p class="text-center">Could not get weather data</p>');
        });
    }
}