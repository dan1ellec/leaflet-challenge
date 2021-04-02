// Storing our API endpoint inside queryUrl
// the url supplies all recorded earthquakes for the last 7 days
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//function createMap
// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
  center: [
    40.7608, -111.8910 // not sure what this is pointing to so might update center, had been using 37.09, -95.71
  ],
  zoom: 4,
  //layers: [streetmap, earthquakeLayer]
});

// var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//       attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//       maxZoom: 18,
//       id: "dark-v10",
//       accessToken: API_KEY
//     });

// darkmap.addTo(myMap);

var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

lightmap.addTo(myMap);


// Performing a GET request to the query URL using d3
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    console.log(data.features);

    console.log("in function");
    
    var earthquakeData = data.features;

    //var earthquakeLayer = [];

    // Loop through the cities array and create one marker for each city object
    for (var i = 0; i < earthquakeData.length; i++) {

        // Conditionals for countries points
        var color = "";
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
        //console.log(color);
        // obtaining coordinates of earthquake
        var location = [earthquakeData[i].geometry.coordinates[1], earthquakeData[i].geometry.coordinates[0]] // the json has them written as long,lat but need lat,long
        //console.log(location);
        // Add circles to map
        var earthquakes = L.circle(location, {
            fillOpacity: 0.75,
            color: color,
            fillColor: color,
            radius: earthquakeData[i].properties.mag * 3000 // Adjust radius
            }).bindPopup("<h3>" + earthquakeData[i].properties.place + "</h3><hr><p>" + new Date(earthquakeData[i].properties.time) + "</p>" + "<br>" + "Magnitude: " + earthquakeData[i].properties.mag).addTo(myMap);
        
        //earthquakes.addTo(myMap);
        //earthquakeLayer.push(earthquakes);
        
        earthquakes.addTo(myMap);
        //console.log(earthquakes);
    };
    // console.log("layer");
    // console.log(earthquakeLayer[1]);
    //createMap(L.layerGroup(earthquakeLayer));
    // Sending our earthquakes layer to the createMap function
    //createMap(earthquakeLayer);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (myMap) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5]
            labels = [];

        function getColor(d) {
              return d > 5  ? '#cd3232' :
                     d > 4  ? '#cd5932' :
                     d > 3  ? '#cd8032' :
                     d > 2  ? '#cda632' :
                     d > 1  ? '#cdcd32' :
                              '#a6cd32' ;
          }

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);






});


// // Creating a function for the earchquale data obtained
// function createFeatures(earthquakeData) {
//     console.log(earthquakeData.length);
//     console.log(earthquakeData.prpoerties);
//     // Defining a function we want to run once for each feature in the features array
//     // Gives each feature a popup describing the place and time of the earthquake
//     function onEachFeature(feature, layer) {
//         layer.bindPopup("<h3>" + feature.properties.place +
//         "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<br>" + "Magnitude: " + feature.properties.mag);
//     }
//     // defining a function inside of a funciton
//     // this funciton onEachFeature is only available when within the createFeatures function
//     // for a given featurea nd layer
//     // will bind a popup which is giving info about the features


//     // Create a GeoJSON layer containing the features array on the earthquakeData object
//     // Run the onEachFeature function once for each piece of data in the array
//     var earthquakes = L.geoJSON(earthquakeData, {
//         onEachFeature: onEachFeature
//     });
//     // passing earthwauke data into L.geojson
//     // takes the geoJSOn and on every key/value i will enact onEachFeature function

//     // L calls leaflet library
//     // Create a circle and pass in some initial options
//     // var earthquakes = L.circle([earthquakeData], {
//     //     color: "green",
//     //     fillColor: "green",
//     //     fillOpacity: 0.75,
//     //     radius: 500,
//     //     onEachFeature: onEachFeature
//     // });

//     // L.circle([45.52, -122.69], {
//     //     color: "green",
//     //     fillColor: "green",
//     //     fillOpacity: 0.75,
//     //     radius: 500
//     // }).addTo(myMap);
//     // needs lat and long of circle
//     // outside colour, fill colour
//     // radius in meters
//     // check documentation for detials on what can be added

//     // Loop through the cities array and create one marker for each city object
//     for (var i = 0; i < earthquakeData.length; i++) {

//         // Conditionals for countries points
//         var color = "";
//         if (countries[i].points > 200) {
//         color = "yellow";
//         }
//         else if (countries[i].points > 100) {
//         color = "blue";
//         }
//         else if (countries[i].points > 90) {
//         color = "green";
//         }
//         else {
//         color = "red";
//         }
    
//         // Add circles to map
//         L.circle(countries[i].location, {
//         fillOpacity: 0.75,
//         color: "white",
//         fillColor: color,
//         // Adjust radius
//         radius: countries[i].points * 1500
//         }).bindPopup("<h1>" + countries[i].name + "</h1> <hr> <h3>Points: " + countries[i].points + "</h3>").addTo(myMap);


//   // Sending our earthquakes layer to the createMap function
//   createMap(earthquakes);
// }




// function createMap(earthquakeLayer) {

//     // Define streetmap and darkmap layers
//     var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//       attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//       tileSize: 512,
//       maxZoom: 18,
//       zoomOffset: -1,
//       id: "mapbox/streets-v11",
//       accessToken: API_KEY
//     });
  
//     var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//       attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//       maxZoom: 18,
//       id: "dark-v10",
//       accessToken: API_KEY
//     });
  
//     // Define a baseMaps object to hold our base layers
//     var baseMaps = {
//       "Street Map": streetmap,
//       "Dark Map": darkmap
//     };
//     // base maps mutually excllusive
  
//     // Create overlay object to hold our overlay layer
//     var overlayMaps = {
//       Earthquakes: earthquakeLayer
//     };
  
//     // Create our map, giving it the streetmap and earthquakes layers to display on load
//     var myMap = L.map("map", {
//       center: [
//         37.09, -95.71 // not sure what this is pointing to so might update center
//       ],
//       zoom: 3,
//       layers: [streetmap, earthquakeLayer]
//     });
  
//     // Create a layer control
//     // Pass in our baseMaps and overlayMaps
//     // Add the layer control to the map
//     L.control.layers(baseMaps, overlayMaps, {
//       collapsed: false
//     }).addTo(myMap);
//   }
//   // adding control that displays options