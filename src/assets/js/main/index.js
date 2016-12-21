// var is = require('is_js');
var GMaps = require('../lib/gmaps');
var mapStylesAdministrative = require('../lib/map-styles');
var bsn = require("../lib/bootstrap.native");
var $$ = require('domtastic');
var reqwest = require('reqwest');
var autoComplete = require('../components/autoComplete');


var Main = {
  viewport: {
    viewPorts: [
      'xs',
      'sm',
      'md',
      'lg'
    ],
    viewPortSize: function() {
      return window.getComputedStyle(document.body, ':before')
        .content.replace(/"/g, '');
    },
    isSize: function(size) {
      if (this.viewPorts.indexOf(size) == -1) {
        throw "no valid viewport name given";
      }
      return this.viewPortSize() == size;
    },
    isEqualOrGreaterThan: function(size) {
      if (this.viewPorts.indexOf(size) == -1) {
        throw "no valid viewport name given";
      }
      return this.viewPorts.indexOf(this.viewPortSize()) >= this.viewPorts.indexOf(size);
    },
  },
  
  addListingNavInit:function () {
    var _this = this;
    var addListingBtn = $$('#nav-add-listing');
    
    var modalFrame = document.getElementById('modalFrame');
    
    addListingBtn.on('click',function (e) {
      
      reqwest({
        url: upages_params.ajaxurl,
        data: {
          action: 'add_listing_modal'
        },
        success: function(resp) {
          var modal = new bsn.Modal(modalFrame,{
            content: JSON.parse(resp.data)
          });
  
          modal.open();
          _this.inputAutoComplete();
          
          var mapContainer = $$(modalFrame).find('#map-modal');
          //
          var mapContainerID = '#' + mapContainer.attr('id');
          //
          var input = document.getElementById('listing_address');
          var searchBox = new google.maps.places.SearchBox(input);
          //
          var map = new GMaps({
            div: mapContainerID,
            zoom: 5,
            zoomControl: false,
            // scrollwheel: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            lat: 48.9257791,
            lng: 24.692838,
            mapType: "roadmap",
            height: '400px',
            width: '100%',
            styles: mapStylesAdministrative,
            bounds_changed:function (e) {
              searchBox.setBounds(map.map.getBounds());
            }
          });
          
          searchBox.addListener('places_changed', function() {
            var places = searchBox.getPlaces();
    
            if (places.length == 0) {
              return;
            }
            
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function(place) {
              var markerContent = '<div class="marker">' +
                                  '<div class="title">' + place.name + ', '+place.vicinity+'</div>' +
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
              } else {
                bounds.extend(place.geometry.location);
              }
            });
            map.map.fitBounds(bounds);
          });
          
        },
        error: function(err) {
          console.log(err);
        }
      });
    });
  },
  
  inputAutoComplete:function () {
    var inputs = $$('input[type="text"]');
    if (inputs.length){
      inputs.forEach(function(e) {
        var _this = $$(e);
        var dataSource = _this.attr('data-auto-complete');
        if (dataSource){
          new autoComplete({
            selector: e,
            minChars: 1,
            source: function(term, suggest) {
              term = term.toLowerCase();
              var choices = JSON.parse(dataSource);
              var suggestions = [];

              choices.forEach(function (e) {
                if (~e.toLowerCase().indexOf(term)) {
                  suggestions.push(e);
                }
              });
              suggest(suggestions);
            }
          });
        }
      });
    }
  },
  openModal: function(target, modalPath) {
    var MAIN = this;
    var modalAtr = {
      'id': target,
      'class': 'modal modal-external fade',
      'tabindex': '-1',
      'role': 'dialog',
      'aria-labelledby': target
    };
    // var modalBox = $$("body")
    //   .append('<div id="' + target + '"></div>')
    //   .find('#' + target)
    //   .attr(modalAtr)
    //   .html('<i class="loading-icon fa fa-circle-o-notch fa-spin"></i>');

    // $("#" + target + ".modal").on("show.bs.modal", function() {
    //     var _this = $(this);
    //     lastModal = _this;
    //     $.ajax({
    //       url: "assets/external/" + modalPath,
    //       // method: "POST",
    //       //dataType: "html",
    //       data: {
    //         id: target
    //       },
    //       success: function(results) {
    //         _this.append(results);
    //         $(".selectpicker").selectpicker();
    //         _this.find(".gallery").addClass("owl-carousel");
    //         MAIN.ratingPassive(".modal");
    //         var img = _this.find(".gallery img:first")[0];
    //         if (img) {
    //           $(img).load(function() {
    //               MAIN.timeOutActions(_this);
    //             });
    //         } else {
    //           MAIN.timeOutActions(_this);
    //         }
    //         MAIN.socialShare();
    //         _this.on("hidden.bs.modal", function() {
    //           // $(lastClickedMarker).removeClass("active");
    //           $(".pac-container").remove();
    //           _this.remove();
    //         });
    //       },
    //       error: function(e) {
    //         console.log(e);
    //       }
    //     });
    //
    //   });
    //
    // $("#" + target + ".modal").modal("show");

  },
  bgTransfer: function() {
    $$(".bg-transfer").forEach(function(element) {
        var _this = $$(element);
        var backgroundImage = _this.attr("data-bg");
      if (backgroundImage){
        _this.css("background-image", "url(" + backgroundImage + ")");
      }else {
        var img = _this.find('img');
        img.css('display','none');
        _this.css("background-image", "url(" + img.attr("src") + ")");
      }
      });
  },
  ratingPassive: function(element) {
    $(element).find(".rating-passive").each(function() {
        var _this = $(this);
        for (var i = 0; i < 5; i++) {
          if (i < _this.attr("data-rating")) {
            $(this)
              .find(".stars")
              .append("<figure class='active fa fa-star'></figure>")
          } else {
            _this.find(".stars")
              .append("<figure class='fa fa-star'></figure>")
          }
        }
      });
  },
  socialShare: function() {
    var socialButtonsEnabled = 1;
    if (socialButtonsEnabled == 1) {
      require('jssocials');
      $(".social-share").jsSocials({
        shares: [
          "twitter",
          "facebook",
          "googleplus",
          "linkedin",
          "pinterest"
        ]
      });
    }
  },
  initializeFitVids: function() {
    var videoBox = $$(".video");
    if (videoBox.length > 0) {
      var fitvids = require('fitvids');
      fitvids(videoBox);
    }
  },
  initializeOwl: function() {
  
    $$(".owl-carousel").forEach(function(element) {
      var _this = $$(element);
      var items = parseInt(_this.attr("data-owl-items"), 10);
      if (!items) {
        items = 1;
      }
      var nav = parseInt(_this.attr("data-owl-nav"), 2);
      if (!nav) {
        nav = false;
      }
      var dots = parseInt(_this.attr("data-owl-dots"), 2);
      if (!dots) {
        dots = false;
      }
      var center = parseInt(_this.attr("data-owl-center"), 2);
      if (!center) {
        center = false;
      }
      var loop = parseInt(_this.attr("data-owl-loop"), 2);
      if (!loop) {
        loop = false;
      }
      var margin = parseInt(_this.attr("data-owl-margin"), 2);
      if (!margin) {
        margin = false;
      }
      var autoWidth = parseInt(_this.attr("data-owl-auto-width"), 2);
      if (!autoWidth) {
        autoWidth = false;
      }
      var navContainer = _this.attr("data-owl-nav-container");
      if (!navContainer) {
        navContainer = false;
      }
      var autoplay = _this.attr("data-owl-autoplay");
      if (!autoplay) {
        autoplay = false;
      }
      var fadeOut = _this.attr("data-owl-fadeout");
      if (!fadeOut) {
        fadeOut = 0;
      } else {
        fadeOut = "fadeOut";
      }
      var owlCarouselOption = {
        navContainer: navContainer,
        animateOut: fadeOut,
        autoplaySpeed: 2000,
        autoplay: autoplay,
        autoheight: 1,
        center: center,
        loop: loop,
        margin: margin,
        autoWidth: autoWidth,
        items: items,
        nav: nav,
        dots: dots,
        autoHeight: true,
        navText: []
      };

      Main.owlCarousel(_this, owlCarouselOption);
    });
  },
  owlCarousel: function(selector, option) {

    if (selector.length > 0) {
      require('owl.carousel');
      $(selector).owlCarousel(option);
    }
  },
  
  trackpadScroll: function(method) {
    var scrollableBox = $(".tse-scrollable");
    var resultsWrapper = $(".results-wrapper");
    var resultsWrapperResults = resultsWrapper.find('.results');
    var resultsWrapperForm = resultsWrapper.find("form");
  
    require('trackpad-scroll-js');
  
    switch (method) {
      case "initialize":
        if (resultsWrapperForm.length) {
          resultsWrapperResults.height(resultsWrapper.height() - resultsWrapper.find('.form')[0].clientHeight);
        }
        break;
      case "recalculate":
        setTimeout(function() {
          if (scrollableBox.length) {
            scrollableBox.TrackpadScrollEmulator("recalculate");
          }
        }, 1000);
        break;
      default:
        if (scrollableBox.length > 0) {
          scrollableBox.TrackpadScrollEmulator();
        }
    }
  },
  // doneResizing: function () {
  //     var $equalHeight = $('.container');
  //     for (var i = 0; i < $equalHeight.length; i++) {
  //         this.equalHeight($equalHeight);
  //     }
  //     this.responsiveNavigation()
  // },
  
  wpas:function () {
    var mapContainer = $$('[data-map-container]');
    var mapContainerID = '#' + mapContainer.attr('id');
    var mapType = mapContainer.attr('data-map-type');
    var ajaxForm = require('../components/ajax-form');
    var map;
    if (mapContainer.length){
      map = new GMaps({
        div: mapContainerID,
        zoom: 5,
        zoomControl: false,
        // scrollwheel: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        lat: 48.9257791,
        lng: 24.692838,
        mapType: "roadmap",
        height: '100%',
        styles: mapStylesAdministrative,
      });
    }
    
    var form = new ajaxForm({
      elem: '[data-ajax-form]',
      
      ajax_complete: function (data) {
        
        if (mapContainer.length){
          var marcers = data.marcers;
  
          marcers.forEach(function(item) {
    
            if (!item.latitude || !item.longitude) {
              return;
            }
    
            var markerContent = '<div class="marker" data-marker-id="' + item.id + '">' +
                                '<div class="title">' + item.title + '</div>' +
                                '<div class="marker-wrapper">' +
                                (item.featured == 1 ? '<div class="tag"><i class="fa fa-check"></i></div>' : '') +
                                '<div class="pin">' + '<div class="image" style="background-image: url(' + item.thumbnail + ');"></div>' +
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
      }
    });
  
    function marcerMouseEvent(e) {
      var marker = $$(e.el).find('.marker');
      var markerID = marker.attr('data-marker-id');
      var resultsContent = $$('#results-content');
      var itemResult = resultsContent.find("[data-listing-id='"+markerID+"'] > a");
      
      itemResult.toggleClass('hover-state');
    }
  },
  mapInit: function() {
    // require('../maps');
  },
  responsiveNavigation: function() {
    if (this.viewport.isSize('xs')) {
      var hasChild = $$(".has-child");

      $$("body").addClass("nav-btn-only");
      hasChild.children("a").attr("data-toggle", "collapse");
      hasChild.find(".nav-wrapper").addClass("collapse");

      $$(".mega-menu .heading").forEach(function(element, iter) {
          var _this = $$(element);
          var elHtml = _this[0].outerHTML;
          var parent = $$(_this.parent());
          var linkCollapseID = '#mega-menu-collapse-' + iter;
          parent.prepend("<a href='" + linkCollapseID + "' class='has-child' aria-controls='" + linkCollapseID + "' data-toggle='collapse'>" + elHtml + "</a>");
          _this.remove();

        });
      $$(".mega-menu ul").forEach(function(element, iter) {
          var _this = $$(element);
          _this.attr("id", "mega-menu-collapse-" + iter);
          _this.addClass("collapse");
        })
    }
  },

  equalHeight: function(container) {
    var currentTallest = 0,
      currentRowStart = 0,
      rowDivs = [],
      $el,
      topPosition = 0;

    if (!this.viewport.isSize('xs')) {
      $(container)
        .find('.equal-height')
        .each(function() {
          $el = $(this);
          $($el)
            .height('auto');
          topPostion = $el.position()
            .top;
          if (currentRowStart != topPostion) {
            for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
              rowDivs[currentDiv].height(currentTallest);
            }
            rowDivs.length = 0; // empty the array
            currentRowStart = topPostion;
            currentTallest = $el.height();
            rowDivs.push($el);
          } else {
            rowDivs.push($el);
            currentTallest = (
              currentTallest < $el.height()) ? (
              $el.height()) : (
              currentTallest);
          }
          for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
            rowDivs[currentDiv].height(currentTallest);
          }
        });
    }
  },

  rating: function() {

    var ratingBox = $$('.visitor-rating .star-rating');

    var ratingElement =
      '<span class="stars">' +
      '<i class="fa fa-star s1" data-score="1"></i>' +
      '<i class="fa fa-star s2" data-score="2"></i>' +
      '<i class="fa fa-star s3" data-score="3"></i>' +
      '<i class="fa fa-star s4" data-score="4"></i>' +
      '<i class="fa fa-star s5" data-score="5"></i>' +
      '<i class="fa fa-star s6" data-score="6"></i>' +
      '<i class="fa fa-star s7" data-score="7"></i>' +
      '<i class="fa fa-star s8" data-score="8"></i>' +
      '<i class="fa fa-star s9" data-score="9"></i>' +
      '<i class="fa fa-star s10" data-score="10"></i>' +
      '</span>';

    if (ratingBox.length > 0) {
      ratingBox.forEach(function(element) {
        var _this = $$(element);
        _this.append(ratingElement);
        if (_this.hasClass('active')) {
          var dataName = _this.attr('data-name');
          _this.append('<input readonly hidden="" name="score_' + dataName + '" id="score_' + dataName + '">');
        }
        // If rating exists
        var rating = _this.attr('data-rating');
        for (var e = 0; e < rating; e++) {
          var rate = e + 1;
          _this.children('.stars')
            .children('.s' + rate)
            .addClass('active');
        }
      });
      var ratingActive = $$('.star-rating.active i');

      ratingActive.on('mouseover mouseout', function(e) {
          e.preventDefault();
          var _this = $$(this);
          var dataScore = _this.attr('data-score');
          for (var i = 0; i < dataScore; i++) {
            var a = i + 1;
            _this.parent()
              .children('.s' + a)
              .toggleClass('hover');
          }
        })
        .on('click', function(e) {
          e.preventDefault();
          var _this = $$(this);
          var dataScore = _this.attr('data-score');
          var input = _this.closest('.star-rating')
            .find("input")
            .val(dataScore);
          _this.parent()
            .children('.fa')
            .removeClass('active');
          for (var i = 0; i < dataScore; i++) {
            var a = i + 1;
            _this.parent()
              .children('.s' + a)
              .addClass('active');
          }
          return false;
        });
    }
  },
  timeOutActions: function(_this) {
    setTimeout(function() {
      if (_this.find(".map")
        .length) {
        var modalDialog = _this.find(".modal-dialog");
        var dataAddress = modalDialog.data("address");
        var dataMarkerDrag = modalDialog.data("marker-drag");
        var dataLatitude = modalDialog.data("latitude");
        var dataLongitude = modalDialog.data("longitude");

        if (dataAddress) {
          simpleMap(0, 0, "map-modal", dataMarkerDrag, dataAddress);
        } else {
          simpleMap(dataLatitude, dataLongitude, "map-modal", dataMarkerDrag);
        }
      }
      Main.initializeOwl();
      Main.initializeFitVids();
      _this.addClass("show");
    }, 200);
  },
};

module.exports = Main;