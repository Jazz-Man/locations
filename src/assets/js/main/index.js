var $$ = require('domtastic');
var reqwest = require('reqwest');

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
};

module.exports = Main;