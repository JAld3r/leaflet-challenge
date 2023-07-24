// Function to get the size of the earthquake marker based on magnitude
function getMarkerSize(magnitude) {
    if (typeof magnitude !== 'number' || isNaN(magnitude)) {
      console.error('Invalid magnitude:', magnitude);
      return 5; // Return a default radius value (adjust as needed)
    }
  
    const radius = magnitude * 4; // You can adjust the multiplier to make the markers larger/smaller
    return radius;
  }
  
  // Function to get the color of the earthquake marker based on depth
  function getMarkerColor(depth) {
    if (typeof depth !== 'number' || isNaN(depth)) {
      console.error('Invalid depth:', depth);
      return '#808080'; // Return a default color for invalid depth
    }
  
    if (depth >= -10 && depth <= 10) {
      return '#00FF00'; // Green for depth between -10 and 10
    } else if (depth > 10 && depth <= 30) {
      return '#40FF00'; // Light green for depth between 11 and 30
    } else if (depth > 30 && depth <= 50) {
      return '#80FF00'; // Yellowish green for depth between 31 and 50
    } else if (depth > 50 && depth <= 70) {
      return '#BFFF00'; // Yellow for depth between 51 and 70
    } else if (depth > 70 && depth <= 90) {
      return '#FFBF00'; // Orange for depth between 71 and 90
    } else {
      return '#FF0000'; // Dark red for depth greater than 90
    }
  }
  
  // Function to create the map and display earthquake markers
  function createMap(earthquakeData) {
    const map = L.map('map').setView([20, 0], 2);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  
    // Loop through the earthquake data and add circles to the map
    earthquakeData.features.forEach(feature => {
      const { geometry, properties } = feature;
      const { mag, place } = properties;
      const { coordinates } = geometry;
      const depth = coordinates[2];
  
      // Check if the magnitude is valid and not undefined
      if (typeof mag === 'undefined') {
        console.error('Magnitude is undefined for feature:', feature);
        return; // Skip this feature and continue with the next one
      }
  
      // Check if the coordinates are valid (i.e., not NaN)
      if (!coordinates || isNaN(coordinates[0]) || isNaN(coordinates[1]) || isNaN(depth)) {
        console.error('Invalid coordinates:', coordinates);
        console.log('Properties:', properties);
        return; // Skip this feature and continue with the next one
      }
  
      const [longitude, latitude] = coordinates;
  
      // Create a circle with size and color based on magnitude and depth
      const circle = L.circleMarker([latitude, longitude], {
        radius: getMarkerSize(mag),
        fillColor: getMarkerColor(depth),
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
  
      // Add a popup with additional information about the earthquake
      circle.bindPopup(`<b>${place}</b><br>Magnitude: ${mag}<br>Depth: ${depth} km`);
  
      // Add the circle to the map
      circle.addTo(map);
    });
  
    // Function to create the legend
    function createLegend() {
    const legend = L.control({ position: 'bottomright' });
  
    legend.onAdd = function (map) {
      const div = L.DomUtil.create('div', 'legend');
      const depths = [-10, 10, 30, 50, 70, 90];
      const colors = ['#00FF00', '#40FF00', '#80FF00', '#BFFF00', '#FFBF00', '#FF0000'];
  
      for (let i = 0; i < depths.length; i++) {
        div.innerHTML += `
          <div>
            <i style="background:${colors[i]}"></i>
            ${depths[i]}${depths[i + 1] ? '&ndash;' + (depths[i + 1] - 1) : '+'} km
          </div>
        `;
      }
      return div;
    };
  
    legend.addTo(map);
  }
  
    // Call the function to create the legend after the markers are added to the map
    createLegend();
  }
  
  // Fetch earthquake data from the provided JSON URL
  const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';
  fetch(url)
    .then(response => response.json())
    .then(data => createMap(data))
    .catch(error => console.error('Error fetching data:', error));
  

  
  