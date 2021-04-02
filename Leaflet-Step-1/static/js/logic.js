// Storing the API endpoint inside queryUrl
// the url supplies all recorded earthquakes for the last 7 days
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Creating the map with centre coordinates and a zoom level
var myMap = L.map("map", {
  center: [
    40.7608, -111.8910 // not sure what this is pointing to so might update center, had been using 37.09, -95.71
  ],
  zoom: 4,
});

// Creating the lightmap layer and adding to 'myMap'
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

lightmap.addTo(myMap);


// Performing a GET request to the query URL using d3
// Once we get a response, using this in the anonymous function written below
d3.json(queryUrl, function(data) {
    
    // testing
    // console.log(data.features);
    
    // accessign the 'features' key of the json data
    var earthquakeData = data.features;

    // Looping through the cities array and creating one marker for each city object
    for (var i = 0; i < earthquakeData.length; i++) {

        // Creating a colour variable
        var color = "";

        // Using if statments to determine the colour of the marker based on the earthquake magnitude
        if (earthquakeData[i].properties.mag > 5) {
            color = '#cd3232';
        }
        else if (earthquakeData[i].properties.mag > 4) {
            color = '#cd5932';
        }
        else if (earthquakeData[i].properties.mag > 3) {
            color = '#cd8032';
        }
        else if (earthquakeData[i].properties.mag > 2) {
            color = '#cda632';
        }
        else if (earthquakeData[i].properties.mag > 1) {
            color = '#cdcd32';
        }
        else {
            color = '#a6cd32';
        }
        
        // obtaining coordinates of the ith earthquake
        var location = [earthquakeData[i].geometry.coordinates[1], earthquakeData[i].geometry.coordinates[0]] // the json has them written as long,lat but need lat,long
        
        // Creating a circle marker for each earthquake
        var earthquakeMarker = L.circle(location, {
            fillOpacity: 0.75,
            color: color, // lookinto border colour
            fillColor: color, // colour is based on if statement
            radius: earthquakeData[i].properties.mag * 3000 // Adjusting radius based on magnitude of earthquake
            }).bindPopup("<h3>" + earthquakeData[i].properties.place + "</h3><hr><p>" + 
            new Date(earthquakeData[i].properties.time) + "</p>" + "<br>" + "Magnitude: " 
            + earthquakeData[i].properties.mag);
            // setting the text of each marker
        
        // adding each marker to the map
        earthquakeMarker.addTo(myMap);
        
    };
    
    // creating a lengend and setting it to the bottom right of webpage
    var legend = L.control({position: 'bottomright'});

    // Adding the content of the legend thorugh the following function
    legend.onAdd = function() {

        // giving classes to the legendfor css styling
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5] // setting the magnitude grades for the the lengend
            //labels = [];

        // setting the colour scale based on earthquake magnitude
        function getColor(m) {
              return m > 5  ? '#cd3232' :
                     m > 4  ? '#cd5932' :
                     m > 3  ? '#cd8032' :
                     m > 2  ? '#cda632' :
                     m > 1  ? '#cdcd32' :
                              '#a6cd32' ;
          }

        // looping through the intervals set in 'grades' and generating a label with a coloured square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };

    // Adding the legend
    legend.addTo(myMap);
});

