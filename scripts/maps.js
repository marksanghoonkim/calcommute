function initMap () {
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {lat: 34.0, lng: -118.28}
  });
  directionsDisplay.setMap(map);


  var startInput = document.getElementById('start');
  var startAutocomplete = new google.maps.places.Autocomplete(startInput);

  var endInput = document.getElementById('end');
  var endAutocomplete = new google.maps.places.Autocomplete(endInput);

  var onChangeHandler = function() {
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  };
  
  var form = document.querySelector("form");
  form.addEventListener("submit", function(event) {
    calculateDurationsAndDistances(directionsService, directionsDisplay);
    event.preventDefault();
  });

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
  // averaging 20 mpg at $3 per gallon
  // calculating 40 times a month
  // 8 cents depeciation per mile

  // TODO: get current cost of gas + input for vehicle mpg
  return (distance / 1609 / 25 * 3 + distance/1609*0.08) * 40;
}

function calculateDurationsAndDistances(directionsService, directionsDisplay) {
  // var dTime = new Date(1455724800);
  directionsService.route({
    origin: document.getElementById('start').value,
    destination: document.getElementById('end').value,
    travelMode: 'DRIVING',
    drivingOptions: {
      departureTime: new Date('February 16, 2016 17:30:00'),
      // trafficModel: 'best_guess'
    }
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

                  var startID = response.geocoded_waypoints[0].place_id;
                  var endID = response.geocoded_waypoints[1].place_id;

                  builtURL = buildGetUrl(startID, endID, 'DRIVING');

                  // getEstimatedTravelTimes(builtURL);

                  console.log(builtURL);

                  console.log(modes);
                  $(".stuff").remove();
                  $(".table").append("<tr class='stuff'> <td> Driving </td><td>" + (modes.driving[0]/60).toFixed(2) + " min</td><td>$" + calculateDrivingCosts(modes.driving[1]).toFixed(2) + "</td></tr>");
                  $(".table").append("<tr class='stuff'> <td> Transit </td><td>" + (modes.transit[0]/60).toFixed(2) + " min</td><td>$100</td></tr>");
                  $(".table").append("<tr class='stuff'> <td> Bicycling </td><td>" + (modes.bicycling[0]/60).toFixed(2) + " min</td><td>$0</td></tr>");
                  $(".table").append("<tr class='stuff'> <td> Walking </td><td>" + (modes.walking[0]/60).toFixed(2) + " min</td><td>$0</td></tr>");

                } else {
                  window.alert('Directions request failed due to ' + status);
                }
              });
            } else {
              window.alert('Directions request failed due to ' + status);
            }
          });
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });

};

function buildGetUrl(start, end, mode) {

  var str1 = 'https://maps.googleapis.com/maps/api/directions/json?';
  var str2 = 'key=AIzaSyBsuyXFzWz2N8WbGJ5dIm97oLUln4gxIHY';
  var str3 = '&origin=place_id:'+ start + '&destination=place_id:' + end;
  var str4 = '&departure_time=1455724800';
  var str5 = '&mode=' + mode;

  return str1 + str2 + str3 + str4 + str5;
};

function getEstimatedTravelTimes(url) {
  $.ajax({
    // type: "GET",
    // headers: Upgrade-Insecure-Requests:1
    // url: url,

    url: url,
    headers: {
      'Access-Control-Request-Headers': 'http://localhost:8000'
    },
    type: 'GET',
    dataType: 'json',
    success: function() { console.log('Success!'); },
    error: function() { console.log('Uh Oh!'); },
    // jsonp: false
  }).done(function (data) {
      console.log(data);
  });

};