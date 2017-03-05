var $$ = require('domtastic');
var template = require('../module/template');
var Hooks = require("../module/hooks");

function wasp_init() {
  var mapContainer = $$('[data-map-container]');
    
  
  if (mapContainer.length) {
    var mapContainerID = '#' + mapContainer.attr('id');
    
    if (mapContainer.length) {

      require.ensure([], function(require){
        var mapStyle = require('../module/map-styles');
        var GMaps = require('../module/gmaps');
        var AjaxForm = require('../module/ajax-form');
        var overlays = [];
        var map = new GMaps({
          div: mapContainerID,
          zoom: 15,
          zoomControl: false,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          lat: -12.043333,
          lng: -77.028333,
          mapType: "roadmap",
          height: '100%',
          width: '100%',
          styles: mapStyle,
          idle: function (e) {
            map.removeOverlay();
            form_init();
          }
        });

        map.addControl({
          id: 'listings-map-view-controll',
          position: 'top_right',
          content: template('listings-map-view-controll'),
          disableDefaultStyles: true
        });

        map.addControl({
          id: 'listings-map-search-form',
          position: 'top_left',
          content: template('listings-map-search-form'),
          disableDefaultStyles: true
        });

        
        function form_init() {
          var form = new AjaxForm({
            elem: '[data-ajax-form]',

            ajax_complete: function (data) {

              var marcers = data.marcers;

              marcers.forEach(function (item, i) {
                if (!item.latitude || !item.longitude) {
                  return;
                }

                var markerContent = template('map-marker', item);

                map.drawOverlay({
                  mouseenter: function (e) {
                    marcerMouseEvent(e);
                  },
                  mouseleave: function (e) {
                    marcerMouseEvent(e);
                  },
                  click: function (e) {
                    map.setCenter(e.lat(), e.lng());
                  },
                  lat: item.latitude,
                  lng: item.longitude,
                  content: markerContent,
                  layer: 'overlayImage',
                  verticalAlign: 'bottom',
                  horizontalAlign: 'center'
                });

                overlays.push(new google.maps.LatLng(item.latitude, item.longitude));

              });

              if (overlays.length) {
                var bounds = new google.maps.LatLngBounds();
                overlays.forEach(function (e) {
                  bounds.extend(e);
                });
                map.map.fitBounds(bounds);
              }

            }
          });
          
          console.log(form);
        }

        function marcerMouseEvent(e) {
          var marker = $$(e.el).find('.marker');
          var markerID = marker.attr('data-marker-id');
          var resultsContent = $$('#results-content');
          var itemResult = resultsContent.find("[data-listing-id='" + markerID + "'] > a");

          itemResult.toggleClass('hover-state');
        }

      },'wpas');
    }
  }
}

Hooks.addAction("_init", wasp_init);
Hooks.addAction("pageLoader.processEnd", wasp_init);
