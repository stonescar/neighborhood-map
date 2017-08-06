var spots = [
    {
        name: 'Nidarosdomen',
        location: {lat: 63.426910, lng: 10.396938}
    },
    {
        name: 'Gamle Bybro',
        location: {lat: 63.428222, lng: 10.401540}
    },
    {
        name: 'Tyholttårnet',
        location: {lat: 63.422357, lng: 10.431935}
    },
    {
        name: 'Lerkendal Stadion',
        location: {lat: 63.412328, lng: 10.404471}
    },
    {
        name: 'Rockheim',
        location: {lat: 63.438753, lng: 10.401607}
    },
    {
        name: 'Kristiansten Festning',
        location: {lat: 63.426893, lng: 10.410639}
    },
    {
        name: 'Munkholmen',
        location: {lat: 63.450705, lng: 10.382645}
    },
    {
        name: 'Torvet',
        location: {lat: 63.430320, lng: 10.394924}
    },
    {
        name: 'Nordre gate',
        location: {lat: 63.432311, lng: 10.397509}
    },
    {
        name: 'Solsiden',
        location: {lat: 63.434635, lng: 10.411799}
    }
]

// Sort by name alphabetically
spots.sort(function(a,b) {return (a.name > b.name) - (a.name < b.name);});