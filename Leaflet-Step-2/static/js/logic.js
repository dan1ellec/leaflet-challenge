// Part 2 - bonus

// Storing our API endpoint inside queryUrl
// the url supplies all recorded earthquakes for the last 7 days
var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Storing the path to the tectonic plate json in a variable  
var tectonicPath = "static/data/plates.json";


// Performing a GET request to the earthquake URL using d3
// Then running a function on that data to create the markers for the earthquakes
d3.json(earthquakeUrl, function(data) {

  // testing
  // console.log(data.features);

  // Obtaining the features section of the json data
  var earthquakeData = data.features;

  // Creating an empty earthquake markers array
  var earthquakeMarkers = [];

  // Looping through the earthquake data and creating one marker for each earthquake
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
          fillOpacity: 0.85,
          color: color, // look into border colour
          fillColor: color, // colour is based on if statement
          radius: (earthquakeData[i].properties.mag)* 25000 // Adjusting radius based on magnitude of earthquake
          }).bindPopup("<h3>" + earthquakeData[i].properties.place + "</h3><hr><p>" + 
          new Date(earthquakeData[i].properties.time) + "</p>" + "<br>" + "Magnitude: " 
          + earthquakeData[i].properties.mag);
          // setting the text of each marker
      
      // adding each individual earthquake marker to the earthquakeMarkers array
      earthquakeMarkers.push(earthquakes);
  };

  // Setting the earthquakeMarkers array as a layer group 
  var earthquakeLayer = L.layerGroup(earthquakeMarkers);

  // Now accessing the tectonic plate json data using d3 
  // Runnning function which creates the tectonic plate layer and binds a pop up
  d3.json(tectonicPath, function(response) { 
  
    // Defining a function we want to run once for each feature (tectonic plate) in the geojson
    // Gives each feature a popup describing the plate name
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h4>" + "Tectonic Plate Name: " + feature.properties.PlateName + "</h4>");
    };

    // Setting a style variable that contains the styling for the plates
    var myStyle = {
        color: "orange",
        weight: 2,
        opacity: 0.65,
        fillColor: "orange",
        fillOpacity: 0
    };

    // Using L.geoJSON on the json data, setting the style as our style variable and 
    // using the onEachFeature function created above
    var tectonicLayer = L.geoJSON(response,{
        style: myStyle,
        onEachFeature: onEachFeature
    });
    
    //console.log(tectonicLayer)

    // Using earthquakeLayer and tectonicLayer as the variables for the createMap function
    // This will run the createMap function below with this data
    createMap(earthquakeLayer, tectonicLayer);

  });

});  

// function which creates the map
function createMap(earthquakeLayer, tectonicLayer) {

    // Defining streetmap layer
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });
  
    // Defining darkmap layer
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "dark-v10",
      accessToken: API_KEY
    });

    // Defining lightmap layer
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "light-v10",
      accessToken: API_KEY
    });
  
    // Defining a baseMaps object to hold the base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap,
      "Light Map": lightmap
    };
  
    // Creating an overlayMaps object to hold the overlay layers
    var overlayMaps = {
      "Earthquakes": earthquakeLayer,
      "Fault Lines": tectonicLayer
    };
  
    // Creating the map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        32.3078, -57 // setting the centre of the map
      ],
      zoom: 3.3, // setting the zoom level
      layers: [streetmap, earthquakeLayer]
    });
  
    // Creating a layer control by passing in baseMaps and overlayMaps
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
    // then adding the layer control to the map

    
    // Creating a legend and setting it to the bottom right of webpage
    var legend = L.control({position: 'bottomright'});

    // Adding the content of the legend through the following function
    legend.onAdd = function() {

        // giving classes to the legend for css styling
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5] // setting the magnitude grades for the legend

        // setting the colour scale based on earthquake magnitude
        function getColor(m) {
              return m > 5  ? '#cd3232' :
                     m > 4  ? '#cd5932' :
                     m > 3  ? '#cd8032' :
                     m > 2  ? '#cda632' :
                     m > 1  ? '#cdcd32' :
                              '#a6cd32' ;
          }

        // looping through the intervals set in 'grades' array and generating a label with a coloured square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };

    // Adding the legend to the map
    legend.addTo(myMap);
};
  