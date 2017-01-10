var GMaps = require('../module/gmaps');
var mapStylesAdministrative = require('../module/map-styles');
var $$ = require('domtastic');
var template = require('../module/template');
var ajaxForm = require('../module/ajax-form');
var bsn = require('../module/bootstrap.native.js');

var viewport = require('../module/viewport');

var heroSection = $$('.hero-section');

if (heroSection.length && heroSection.hasClass('has-map')) {
  var mapContainer = $$('[data-map-container]');
  var mapContainerID = '#' + mapContainer.attr('id');
  
  if (mapContainer.length) {
    var controlView = template('hero-section-map-controll');
    var map = new GMaps({
      div: mapContainerID,
      zoom: 15,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      lat: 48.9257791,
      lng: 24.692838,
      mapType: "roadmap",
      height: '100%',
      styles: mapStylesAdministrative,
      idle: function (e) {
        var form = new ajaxForm({
          elem: '[data-ajax-form]',
          
          ajax_complete: function (data) {
            
            var marcers = data.marcers;
            
            marcers.forEach(function (item, i) {
              if (!item.latitude || !item.longitude) {
                return;
              }
              
              
             var markerContent = template('map-marker',item);
              
              map.drawOverlay({
                mouseenter: function (e) {
                  marcerMouseEvent(e);
                },
                mouseleave: function (e) {
                  marcerMouseEvent(e);
                },
                lat: item.latitude,
                lng: item.longitude,
                content: markerContent,
                layer: 'overlayImage',
                verticalAlign: 'bottom',
                horizontalAlign: 'center'
              });
              
            });
          }
        });
        var formBox = form.elem.closest('.form.search-form.vertical');
        
        formBox.removeClass('hide').addClass('show');
        if (!viewport.isSize('xs')) {
          var heroSectionHeigh = heroSection[0].clientHeight;
          var formWrapperHeight = formBox.find('.wrapper')[0].clientHeight;
          formBox.css({
            'position': 'absolute',
            'top': ((heroSectionHeigh / 2) - (formWrapperHeight / 2) ) + 'px'
          });
        }
      }
    });
    
    map.addControl({
      position: 'top_right',
      content: controlView,
      disableDefaultStyles:true,
      style: {
        margin: '5px'
      }
    });
    
    var btnControll = $$(map.controls).find('[data-toggle=buttons]');
    
    btnControll.forEach(function (element) {
      new bsn.Button(element);
      element.addEventListener('bs.button.change',function (e) {
        console.log(e);
      })
    });
  }
  
  function marcerMouseEvent(e) {
    var marker = $$(e.el).find('.marker');
    var markerID = marker.attr('data-marker-id');
    var resultsContent = $$('#results-content');
    var itemResult = resultsContent.find("[data-listing-id='" + markerID + "'] > a");
    
    itemResult.toggleClass('hover-state');
  }
}