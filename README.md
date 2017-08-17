# Neighborhood map
A webpage that displays interesting spots in a neighborhood on a map. In this case the neighborhood is Trondheim, Norway. All spots hold contact information, rating and reviews from Foursquare and beautiful pictures from flickr. This project is part of my Full-Stack Nanodegree at [Udacity.com](http://udacity.com)

## Launching
This is a pure HTML, CSS and Javascript app so you can easily launch the app in one of the following three ways
- Upload the project folder to a server
- Run the app on a local server and access it at http://localhost:[port_number]
- Or just open `index.html` in your browser

## Cusomization
If you want to customize this app for _your_ neighborhood, that's very easy. Open the `js/spots.js` file and modify the objects in the `spots` array. Each object has to properties; `name` and `location`. `location` takes latitude and longitude coordinates. I recommend using http://latlong.net to find the coordinates you need.

## Attribution
This app is made, thanks to these tools and services:
- [Knockout](http://knockoutjs.com) - Javascript MVVM Framework
- [Bootstrap](http://getbootstrap.com) - HTML, CSS and JS Framework
- [Superhero](https://bootswatch.com/superhero/) - Bootstrap theme from [bootswatch.com](http://bootswatch.com)
- [Google Maps](http://maps.google.com)
- [Forsquare](http://foursquare.com) - For information and reviews of spots
- [Flickr](http://flickr.com) - All images has been provided by flickr
- [OpenWeatherMap](http://openweathermap.org) - Provider og weather forcast

## Licensing
This project is licensed under the [MIT License](LICENSE)