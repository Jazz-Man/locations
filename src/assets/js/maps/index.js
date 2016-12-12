var $$ = require('domtastic');
var reqwest = require('reqwest');
var Main = require("../main/index.js");
var mapContainer = $$('[data-map-container]');
var mapContainerID = '#' + mapContainer.attr('id');
var mapType = mapContainer.attr('data-map-type');

if (mapContainerID) {
  require.ensure([], function(require) {
    var GMaps = require('../lib/gmaps');
    var mapStylesAdministrative = require('../lib/map-styles');
    
    var map = new GMaps({
      div: mapContainerID,
      zoom: 14,
      zoomControl: false,
      // scrollwheel: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      lat: 40.7344458,
      lng: -73.86704922,
      mapType: "roadmap",
      // idle: function() {
      //   reqwest({
      //     url: 'http://localhost:3000/listings',
      //     type: 'json',
      //     error: function(err) {
      //       console.log(err);
      //     },
      //     success: function(markers) {
      //       loadMarker(markers);
      //       renderResults();
      //     }
      //   });
      // },
      height: '100%',
      styles: mapStylesAdministrative,
    });
    
    function marcerMouseEvent(e) {
      var marker = $$(e.el).find('.marker');
      var markerID = marker.attr('data-marker-id');
      var itemResult = $$("#results-content [data-id='"+markerID+"'] > a");
  
      itemResult.toggleClass('hover-state');
    }
    
    function loadMarker(data) {
      
      data.forEach(function(item) {
        
        if (!item.latitude || !item.longitude) {
          return;
        }
        
        var marker, thumbnailImage, markerContent;
        
        if (item["gallery"] === undefined) {
          thumbnailImage = require("../../img/items/default.png");
        } else {
          thumbnailImage = item["gallery"][0];
        }
        
        markerContent = '<div class="marker" data-marker-id="' + item.id + '">' +
                        '<div class="title">' + item.title + '</div>' +
                        '<div class="marker-wrapper">' +
                        (item.featured == 1 ? '<div class="tag"><i class="fa fa-check"></i></div>' : '') +
                        '<div class="pin">' + '<div class="image" style="background-image: url(' + thumbnailImage + ');"></div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
        
        map.drawOverlay({
          mouseenter: function(e) {
            marcerMouseEvent(e);
          },
          mouseleave: function(e) {
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
    
    function renderResults() {
      var newMarkers = [];
      var resultsArray = [];
      var visibleMarkersId = [];
      var visibleMarkersOnMap = [];
      // for (var i = 0; i < newMarkers.length; i++) {
      //   if (map.getBounds().contains(newMarkers[i].getPosition())) {
      //     visibleMarkersOnMap.push(newMarkers[i]);
      //     visibleMarkersId.push($(newMarkers[i].content.firstChild).data("id"));
      //     newMarkers[i].setVisible(true);
      //     markerCluster.repaint();
      //   }
      //   else {
      //     newMarkers[i].setVisible(false);
      //   }
      // }
      // Ajax load data for sidebar results after markers are placed
      $.ajax({
        url    : "assets/external/sidebar_results.html",
        method : "GET",
        data   : {
          markers: visibleMarkersId
        },
        success: function (results) {
          var resultItem = $(".result-item");
          resultsArray.push(results);
          $(".results-wrapper #results-content").html(results);
          $(".results-wrapper .section-title h2 .results-number").html(visibleMarkersId.length);
          Main.ratingPassive(".results-wrapper .results");
          resultItem.on("mouseenter", function () {
            var _thisID = $(this).data("id");
            $(".map .marker[data-id=" + _thisID + "]").addClass("hover-state");
          }).on("mouseleave", function () {
            var _thisID = $(this).data("id");
            $(".map .marker[data-id=" + _thisID + "]").removeClass("hover-state");
          });
          Main.trackpadScroll("recalculate");
          // Show detailed information in sidebar
          resultItem.children("a").on("click", function (e) {
            var lastMapMarker;
            var _this = $(this);
            var thisParentID = _this.parent().data("id");
            if (sidebarResultTarget == "sidebar") {
              e.preventDefault();
              openSidebarDetail(thisParentID);
            }
            else if (sidebarResultTarget == "modal") {
              e.preventDefault();
              openModal(thisParentID, "modal_item.html");
            }
          });
        },
        error  : function (e) {
          console.log(e);
        }
      });
    }
  });
}