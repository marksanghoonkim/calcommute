function initMap() {
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  // var distanceMatrixService = new google.maps.DistanceMatrixRequest;
  // var distanceMatrixResponseService = new google.maps.DistanceMatrixResponseElement;

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {lat: 34.0, lng: -118.28}
  });
  directionsDisplay.setMap(map);


  var startInput = document.getElementById('start');
  var startAutocomplete = new google.maps.places.Autocomplete(startInput);

  var endInput = document.getElementById('end');
  var endAutocomplete = new google.maps.places.Autocomplete(endInput);

  // autocomplete.bindTo('bounds', map);

  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // var infowindow = new google.maps.InfoWindow();
  // var marker = new google.maps.Marker({
  //   map: map
  // });
  // marker.addListener('click', function() {
  //   infowindow.open(map, marker);
  // });

  // autocomplete.addListener('place_changed', function() {
  //   infowindow.close();
  //   var place = autocomplete.getPlace();
  //   if (!place.geometry) {
  //     return;
  //   }

  //   if (place.geometry.viewport) {
  //     map.fitBounds(place.geometry.viewport);
  //   } else {
  //     map.setCenter(place.geometry.location);
  //     map.setZoom(17);
  //   }

  //   // Set the position of the marker using the place ID and location.
  //   marker.setPlace({
  //     placeId: place.place_id,
  //     location: place.geometry.location
  //   });
  //   marker.setVisible(true);

  //   infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
  //       'Place ID: ' + place.place_id + '<br>' +
  //       place.formatted_address);
  //   infowindow.open(map, marker);
  // });


  var onChangeHandler = function() {
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  };
  
  var form = document.querySelector("form");
  form.addEventListener("submit", function(event) {
    calculateDurationsAndDistances(directionsService, directionsDisplay);
    event.preventDefault();
  });
  
  // document.getElementById('start').addEventListener('change', onChangeHandler);
  // document.getElementById('end').addEventListener('change', onChangeHandler);
  document.getElementById('mode').addEventListener('change', onChangeHandler);
}

// times are stored in minutes
// distances are stored in meters
var modes = {
  driving: [],
  transit: [],
  bicycling: [],
  walking: []
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  directionsService.route({
    origin: document.getElementById('start').value,
    destination: document.getElementById('end').value,
    travelMode: document.getElementById('mode').value
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      console.log(response);
      console.log(response.routes[0].legs[0].duration.value, " minutes");
      console.log(response.routes[0].legs[0].distance.value, " meters");
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

function calculateDrivingCosts(distance) {
  // averaging 20 mph at $3 per gallon
  // calculating 40 times a week
  // 8 cents depeciation per mile
  return (distance / 1609 / 25 * 3 + distance/1609*0.08) * 40;
}

function calculateDurationsAndDistances(directionsService, directionsDisplay) {
  directionsService.route({
    origin: document.getElementById('start').value,
    destination: document.getElementById('end').value,
    travelMode: 'DRIVING'
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      console.log(response);
      directionsDisplay.setDirections(response);
      if (modes.driving.length === 2) {
        modes.driving[0] = response.routes[0].legs[0].duration.value;
        modes.driving[1] = response.routes[0].legs[0].distance.value;

      } else {
        modes.driving.push(response.routes[0].legs[0].duration.value, response.routes[0].legs[0].distance.value);
      }
      

      directionsService.route({
        origin: document.getElementById('start').value,
        destination: document.getElementById('end').value,
        travelMode: 'TRANSIT'
      }, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          if (modes.transit.length === 2) {
            modes.transit[0] = response.routes[0].legs[0].duration.value;
            modes.transit[1] = response.routes[0].legs[0].distance.value;

          } else {
            modes.transit.push(response.routes[0].legs[0].duration.value, response.routes[0].legs[0].distance.value);
          }
          
          directionsService.route({
            origin: document.getElementById('start').value,
            destination: document.getElementById('end').value,
            travelMode: 'BICYCLING'
          }, function(response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
              if (modes.bicycling.length === 2) {
                modes.bicycling[0] = response.routes[0].legs[0].duration.value;
                modes.bicycling[1] = response.routes[0].legs[0].distance.value;

              } else {
                modes.bicycling.push(response.routes[0].legs[0].duration.value, response.routes[0].legs[0].distance.value);
              }
              // modes.bicycling.push(response.routes[0].legs[0].duration.value, response.routes[0].legs[0].distance.value);
              
              directionsService.route({
                origin: document.getElementById('start').value,
                destination: document.getElementById('end').value,
                travelMode: 'WALKING'
              }, function(response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                  if (modes.walking.length === 2) {
                    modes.walking[0] = response.routes[0].legs[0].duration.value;
                    modes.walking[1] = response.routes[0].legs[0].distance.value;

                  } else {
                    modes.walking.push(response.routes[0].legs[0].duration.value, response.routes[0].legs[0].distance.value);
                  }

                  // modes.walking.push(response.routes[0].legs[0].duration.value, response.routes[0].legs[0].distance.value);
                  // console.log('WALKING');
                  // console.log(response.routes[0].legs[0].duration.value, " minutes");
                  // console.log(response.routes[0].legs[0].distance.value, " meters");
                  console.log(modes);
                  $(".table").empty();
                  $(".table").append("<p> Driving will take " + (modes.driving[0]/60).toFixed(2) + " minutes each way.</p>");
                  $(".table").append("<p> Driving will cost " + calculateDrivingCosts(modes.driving[1]).toFixed(2) + " dollars per month.</p>");
                  $(".table").append("<p> Transit will take " + (modes.transit[0]/60).toFixed(2) + " minutes each way.</p>");
                  $(".table").append("<p> Transit will cost $100 per month.</p>");
                  $(".table").append("<p> Bicycling will take " + (modes.bicycling[0]/60).toFixed(2) + " minutes each way.</p>");
                  $(".table").append("<p> Bicycling will cost $0 (if you have a bike).</p>");
                  $(".table").append("<p> Walking will take " + (modes.walking[0]/60).toFixed(2) + " minutes each way.</p>");
                  $(".table").append("<p> Walking will cost $0.</p>");
                  // need to display the stuff



                } else {
                  window.alert('Directions request failed due to ' + status);
                }
              });

              // console.log('BICYCLING');
              // console.log(response.routes[0].legs[0].duration.value, " minutes");
              // console.log(response.routes[0].legs[0].distance.value, " meters");
            } else {
              window.alert('Directions request failed due to ' + status);
            }
          });


          // console.log('TRANSIT');
          // console.log(response.routes[0].legs[0].duration.value, " minutes");
          // console.log(response.routes[0].legs[0].distance.value, " meters");
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });

      // console.log('DRIVING');
      // console.log(response.routes[0].legs[0].duration.value, " minutes");
      // console.log(response.routes[0].legs[0].distance.value, " meters");
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });

};

function buildGetUrl() {

  var str1 = 'https://maps.googleapis.com/maps/api/directions/json?';
  var str2 = 'key=AIzaSyBsuyXFzWz2N8WbGJ5dIm97oLUln4gxIHY';
  var str3 = '&origin=Beverly+Hills,+CA&destination=604+Arizona+Ave,+Santa+Monica,+CA+90401';
  var str4 = '&departure_time=1455724800';
  var str5 = '&mode=bicycling';
};

function getEstimatedTravelTimes(url) {
  // $.ajax({
  //   url: url,
  //   data: data,
  //   success: success,
  //   dataType: dataType
  // });
};