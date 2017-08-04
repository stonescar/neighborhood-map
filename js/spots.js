var spots = [
    {
        name: 'Nidarosdomen'
    },
    {
        name: 'Gamle bybro'
    },
    {
        name: 'Tyholttårnet'
    },
    {
        name: 'Lerkendal Stadion'
    },
    {
        name: 'Rockheim'
    },
    {
        name: 'Kristiansten Festning'
    },
    {
        name: 'Munkholmen'
    },
    {
        name: 'Torvet'
    },
    {
        name: 'Nordre gate'
    }
]

// Sort by name alphabetically
spots.sort(function(a,b) {return (a.name > b.name) - (a.name < b.name);});