// TRYING BETTER LAYOUT



// Storing our API endpoint inside queryUrl
// the url supplies all recorded earthquakes for the last 7 days
//var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
//  will activate at the bottom of the page 

//var tectonicPath = "static/data/plates.json";

//function layers(earthquakeUrl, tectonicPath) {

var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  //  will activate at the bottom of the page 
  
var tectonicPath = "static/data/plates.json";

    // function to create the markers for earthquake data
    // Performing a GET request to the query URL using d3
d3.json(earthquakeUrl, function(data) {

  // Once we get a response, send the data.features object to the createFeatures function
  console.log(data.features);

  var earthquakeData = data.features;

  var earthquakeMarkers = [];

  // Loop through the cities array and create one marker for each city object
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
      var earthquakes = L.circle(location, {
          fillOpacity: 0.75,
          color: color, // lookinto border colour
          fillColor: color, // colour is based on if statement
          radius: earthquakeData[i].properties.mag * 3000 // Adjusting radius based on magnitude of earthquake
          }).bindPopup("<h3>" + earthquakeData[i].properties.place + "</h3><hr><p>" + 
          new Date(earthquakeData[i].properties.time) + "</p>" + "<br>" + "Magnitude: " 
          + earthquakeData[i].properties.mag);
          // setting the text of each marker
      
      earthquakeMarkers.push(earthquakes);
  };

  var earthquakeLayer = L.layerGroup(earthquakeMarkers);

  // function to create for tectonic 
  d3.json(tectonicPath, function(response) { 
      
    //checking
    console.log(response)
    console.log("hello")

    // Define a function we want to run once for each feature (tectonic plate) in the geojson
    // Give each feature a popup describing the plate name
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + "Tectonic Plate Name: " + feature.properties.PlateName + "</h3><hr>");
    };

    var myStyle = {
        color: "orange",
        weight: 2,
        opacity: 0.65,
        fillColor: "orange",
        fillOpacity: 0
    };

    var tectonicLayer = L.geoJSON(response,{
        style: myStyle,
        onEachFeature: onEachFeature
    });
    
    console.log(tectonicLayer)
    
    // didn't need this part!!!
    //var tectonicLayer = L.layerGroup(tectonicPlates);

    createMap(earthquakeLayer, tectonicLayer);
    //console.log(tectonicLayer)
  });

});  


// might need to put the two d3.jsons in the one function along with create map
// will need to invoke this function somewhere 
// or do I put in same function

// function to create the map

function createMap(earthquakeLayer, tectonicLayer) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "dark-v10",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };
    // base maps mutually excllusive
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      "Earthquake Layer": earthquakeLayer,
      "Tectonic Layer": tectonicLayer
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        37.09, -95.71 // not sure what this is pointing to so might update center
      ],
      zoom: 3,
      layers: [streetmap, earthquakeLayer]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);


    // LEGEND
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
};
  


// adding control that displays options

// runnign function

