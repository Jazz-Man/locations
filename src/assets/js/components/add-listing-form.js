const GMaps = require('../module/gmaps');
const mapStylesAdministrative = require('../module/map-styles');
const $$ = require('domtastic');

if ($$(document.body).hasClass('add-listing')) {
  const input_adress = $$('.input-address');
  const input_lat = $$('.input-lat');
  const input_lng = $$('.input-lng');
  const input = document.getElementById('listing_address');
  const searchBox = new google.maps.places.SearchBox(input);
  const map = new GMaps({
    div: '#map',
    zoom: 5,
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    lat: 48.9257791,
    lng: 24.692838,
    mapType: "roadmap",
    height: '400px',
    width: '100%',
    styles: mapStylesAdministrative,
    bounds_changed: function (e) {
      searchBox.setBounds(map.map.getBounds());
    }
  });
  searchBox.addListener('places_changed', function () {
    const places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    places.forEach(function (place) {
      
      input_adress.val(place.formatted_address);
      input_lat.val(place.geometry.location.lat());
      input_lng.val(place.geometry.location.lng());

      const markerContent = '<div class="marker">' +
          '<div class="title">' + place.name + ', ' + place.vicinity + '</div>' +
          '<div class="marker-wrapper">' +
          '<div class="tag"><i class="fa fa-check"></i></div>' +
          '<div class="pin">' +
          '<div class="image"></div>' +
          '</div>' +
          '</div>' +
          '</div>';

      map.drawOverlay({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        content: markerContent,
        layer: 'overlayImage',
        verticalAlign: 'bottom',
        horizontalAlign: 'center'
      });
      
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      }
      else {
        bounds.extend(place.geometry.location);
      }
    });
    map.map.fitBounds(bounds);
  });
}