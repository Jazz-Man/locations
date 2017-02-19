var GMaps = require('../module/gmaps');
var mapStylesAdministrative = require('../module/map-styles');
var $$ = require('domtastic');
var template = require('../module/template');
var AjaxForm = require('../module/ajax-form');
// var bsn = require('../module/bootstrap.native.js');

var viewport = require('../module/viewport');

var mapContainer = $$('[data-map-container]');

if (mapContainer.length ) {
  var mapContainerID = '#' + mapContainer.attr('id');
  
  if (mapContainer.length) {
    var controlView = template('hero-section-map-controll');
    var overlays = [];
    var map = new GMaps({
      div: mapContainerID,
      zoom: 15,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      lat: 51.503454,
      lng: -0.119562,
      mapType: "roadmap",
      height: '100%',
      width: '100%',
      styles: mapStylesAdministrative,
      idle: function (e) {
        map.removeOverlay();
      }
    });
  
    // var form = new AjaxForm({
    //   elem: '[data-ajax-form]',
    //
    //   ajax_complete: function (data) {
    //
    //     var marcers = data.marcers;
    //
    //     marcers.forEach(function (item, i) {
    //       if (!item.latitude || !item.longitude) {
    //         return;
    //       }
    //
    //       var markerContent = template('map-marker', item);
    //
    //       map.drawOverlay({
    //         mouseenter: function (e) {
    //           marcerMouseEvent(e);
    //         },
    //         mouseleave: function (e) {
    //           marcerMouseEvent(e);
    //         },
    //         click:function (e) {
    //           map.setCenter(e.lat(), e.lng());
    //         },
    //         lat: item.latitude,
    //         lng: item.longitude,
    //         content: markerContent,
    //         layer: 'overlayImage',
    //         verticalAlign: 'bottom',
    //         horizontalAlign: 'center'
    //       });
    //
    //       overlays.push(new google.maps.LatLng(item.latitude, item.longitude));
    //
    //     });
    //
    //     if (overlays.length){
    //       var bounds = new google.maps.LatLngBounds();
    //       overlays.forEach(function (e) {
    //         bounds.extend(e);
    //       });
    //       map.map.fitBounds(bounds);
    //     }
    //
    //   }
    // });
    //
    // var formBox = form.elem.closest('.form.search-form.vertical');
    //
    // formBox.removeClass('hide').addClass('show');
    
    // if (!viewport.isSize('xs')) {
    //   var heroSectionHeigh = heroSection[0].clientHeight;
    //   var formWrapperHeight = formBox.find('.wrapper')[0].clientHeight;
    //   formBox.css({
    //     'position': 'absolute',
    //     'top': (
    //            (
    //            heroSectionHeigh / 2) - (
    //            formWrapperHeight / 2) ) + 'px'
    //   });
    // }
    
    // map.addControl({
    //   position: 'top_right',
    //   content: controlView,
    //   disableDefaultStyles: true,
    //   style: {
    //     margin: '5px'
    //   }
    // });
    
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