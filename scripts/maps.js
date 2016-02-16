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

  var onChangeHandler = function() {
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  };
  
  var form = document.querySelector("form");
  form.addEventListener("submit", function(event) {
    calculateAndDisplayRoute(directionsService, directionsDisplay);
    event.preventDefault();
  });
  
  // document.getElementById('start').addEventListener('change', onChangeHandler);
  // document.getElementById('end').addEventListener('change', onChangeHandler);
  document.getElementById('mode').addEventListener('change', onChangeHandler);
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