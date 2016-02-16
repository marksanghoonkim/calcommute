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
  document.getElementById('start').addEventListener('change', onChangeHandler);
  document.getElementById('end').addEventListener('change', onChangeHandler);
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
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}