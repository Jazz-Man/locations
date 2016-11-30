var Gmaps = require('gmaps');

var mapStylesAdministrative = [
  {
    "featureType": "administrative",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#c6c6c6"
    }]
  }, {
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [{
      "color": "#f2f2f2"
    }]
  }, {
    "featureType": "poi",
    "elementType": "all",
    "stylers": [{
      "visibility": "off"
    }]
  }, {
    "featureType": "road",
    "elementType": "all",
    "stylers": [{
      "saturation": -100
    }, {
      "lightness": 45
    }]
  }, {
    "featureType": "road.highway",
    "elementType": "all",
    "stylers": [{
      "visibility": "simplified"
    }]
  }, {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [{
      "color": "#ffffff"
    }]
  }, {
    "featureType": "road.arterial",
    "elementType": "labels.icon",
    "stylers": [{
      "visibility": "off"
    }]
  }, {
    "featureType": "transit",
    "elementType": "all",
    "stylers": [{
      "visibility": "off"
    }]
  }, {
    "featureType": "water",
    "elementType": "all",
    "stylers": [{
      "color": "#dde6e8"
    }, {
      "visibility": "on"
    }]
  }];

var gmaps = new Gmaps({
  div: '#map-homepage',
  zoom: 16,
  lat: -12.043333,
  lng: -77.028333,
  mapTypeId  : "roadmap",
  height:'100%',
  styles: mapStylesAdministrative
});
// gmaps.addStyle({style: mapStylesAdministrative});
gmaps.setCenter(-12.043333, -77.028333);