var GMaps = require('../module/gmaps');
var mapStylesAdministrative = require('../module/map-styles');
var $$ = require('domtastic');
var template = require('../module/template');
var AjaxForm = require('../module/ajax-form');
// var wp = require('../module/wp');

// wp.users().me().then(function (listings) {
//   console.log(listings);
// }).catch(function (err) {
//   console.log(err);
// });

var viewport = require('../module/viewport');
var Hooks = require("../module/hooks");


function wasp_init() {
  var mapContainer = $$('[data-map-container]');
  
  if (mapContainer.length) {
    var mapContainerID = '#' + mapContainer.attr('id');
    
    if (mapContainer.length) {
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
        styles: mapStylesAdministrative,
        idle: function (e) {
          map.removeOverlay();
          form_init();
        }
      });
      
      map.addControl({
        position: 'top_right',
        content: template('listings-map-view-controll'),
        disableDefaultStyles: true
      });
      
      map.addControl({
        position: 'top_left',
        content: template('listings-map-search-form'),
        disableDefaultStyles: true,
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
      }
      
      // var btnControll = $$(map.controls).find('[data-toggle=buttons]');
      
      
      // btnControll.forEach(function (element) {
      //   new bsn.Button(element);
      //   element.addEventListener('bs.button.change', function (e) {
      //     console.log(e);
      //   })
      // });
    }
    
    function marcerMouseEvent(e) {
      var marker = $$(e.el).find('.marker');
      var markerID = marker.attr('data-marker-id');
      var resultsContent = $$('#results-content');
      var itemResult = resultsContent.find("[data-listing-id='" + markerID + "'] > a");
      
      itemResult.toggleClass('hover-state');
    }
  }
}

Hooks.addAction("_init", wasp_init);
Hooks.addAction("pageLoader.processEnd", wasp_init);
