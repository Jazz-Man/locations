var GMaps = require('../module/gmaps');
var mapStylesAdministrative = require('../module/map-styles');
var $$ = require('domtastic');
var reqwest = require('reqwest');
var autoComplete = require('../module/autoComplete');
// require('../components/profile');

var Main = {
  viewport: {
    viewPorts: [
      'xs',
      'sm',
      'md',
      'lg'
    ],
    viewPortSize: function () {
      return window.getComputedStyle(document.body, ':before')
                   .content.replace(/"/g, '');
    },
    isSize: function (size) {
      if (this.viewPorts.indexOf(size) == -1) {
        throw "no valid viewport name given";
      }
      return this.viewPortSize() == size;
    },
    isEqualOrGreaterThan: function (size) {
      if (this.viewPorts.indexOf(size) == -1) {
        throw "no valid viewport name given";
      }
      return this.viewPorts.indexOf(this.viewPortSize()) >= this.viewPorts.indexOf(size);
    }
  },
  
  addListingFormInit: function () {
    
    if ($$(document.body).hasClass('add-listing')) {
      var input_adress = $$('.input-address');
      var input_lat = $$('.input-lat');
      var input_lng = $$('.input-lng');
      var input = document.getElementById('listing_address');
      var searchBox = new google.maps.places.SearchBox(input);
      var map = new GMaps({
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
        var places = searchBox.getPlaces();
        
        if (places.length == 0) {
          return;
        }
        
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
          
          input_adress.val(place.formatted_address);
          input_lat.val(place.geometry.location.lat());
          input_lng.val(place.geometry.location.lng());
          
          var markerContent = '<div class="marker">' +
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
  },
   
  
  ratingPassive: function (element) {
    $(element).find(".rating-passive").each(function () {
      var _this = $(this);
      for (var i = 0; i < 5; i++) {
        if (i < _this.attr("data-rating")) {
          $(this)
            .find(".stars")
            .append("<figure class='active fa fa-star'></figure>")
        }
        else {
          _this.find(".stars")
               .append("<figure class='fa fa-star'></figure>")
        }
      }
    });
  },
  
  socialShare: function () {
    var socialButtonsEnabled = 1;
    if (socialButtonsEnabled == 1) {
      require('../module/jssocials');
      $(".social-share").jsSocials({
        url: "http://www.google.com",
        text: "Google Search Page",
        showLabel: false,
        showCount: "inside",
        shares: ["twitter", "facebook", "googleplus", "linkedin", "pinterest"]
      });
    }
  },
  
  initializeOwl: function () {
    
    $$(".owl-carousel").forEach(function (element) {
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
      }
      else {
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
        navText: [
          "<i class='fa fa-2x fa-chevron-circle-left'></i>",
          "<i class='fa fa-2x fa-chevron-circle-right'></i>"
        ]
      };
      
      Main.owlCarousel(_this, owlCarouselOption);
    });
  },
  owlCarousel: function (selector, option) {
    
    if (selector.length > 0) {
      require('owl.carousel');
      $(selector).owlCarousel(option);
    }
  },
  
  rating: function () {
    
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
    
    if (ratingBox.length) {
      ratingBox.forEach(function (element) {
        var _this = $$(element);
        _this.append(ratingElement);
        if (_this.hasClass('active')) {
          var dataName = _this.attr('data-name');
          _this.append('<input readonly hidden="" name="score_' + dataName + '" id="score_' + dataName + '">');
        }
        var rating = _this.attr('data-rating');
        for (var e = 0; e < rating; e++) {
          var rate = e + 1;
          _this.children('.stars')
               .children('.s' + rate)
               .addClass('active');
        }
      });
      var ratingActive = $$('.star-rating.active i');
      
      ratingActive.on('mouseover mouseout', function (e) {
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
                  .on('click', function (e) {
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
  }
};

module.exports = Main;