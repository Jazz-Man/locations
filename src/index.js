require('./assets/scss/style.scss');

var $$ = require('domtastic');

var resizeId;
var lastModal;

var Main = require('./assets/js/main');


$$(document).ready(function () {
  "use strict";
  
  Main.trackpadScroll();
  Main.mapInit();
  require('bootstrap-select');
  // require('./assets/js/maps');
  
  if ($(".date-picker").length) {
    require.ensure([],function (require) {
      require('bootstrap-datepicker');
      $(".date-picker").datepicker();
    });
  }
  
  if (Main.viewport.isSize('xs')) {
    $(".map-wrapper").height($(window).height() - $("#page-header").height());
    $(".has-background").height($(window).height() - $("#page-header").height());
  }
  else {
    $(".hero-section.full-screen").height($(window).height() - $("#page-header").height());
  }

//  Social Share -------------------------------------------------------------------------------------------------------
  
  if ($(".social-share").length) {
    Main.socialShare();
  }

//  Count down  --------------------------------------------------------------------------------------------------------
  
  if ($(".count-down").length) {
    require.ensure([],function (require) {
      require('countdown');
      var date = new Date();
      $(".count-down").countdown({
        until    : new Date(date.getFullYear(), date.getMonth(), date.getDate() + 2),
        padZeroes: true,
        format   : 'HMS'
      });
    });
  }

// Render hero search form ---------------------------------------------------------------------------------------------
  
  if ($(".hero-section .form").find("select").length) {
    $(".search-form select").on("rendered.bs.select", function () {
      $(".search-form").addClass("show");
      if (!Main.viewport.isSize('xs')) {
        $(".search-form.vertical").css("top", ($(".hero-section").height() / 2) - ($(".search-form .wrapper").height() / 2));
      }
      Main.trackpadScroll("initialize");
    });
  }
  else {
    $(".search-form").addClass("show");
    if (!Main.viewport.isSize('xs')) {
      $(".search-form.vertical").css("top", ($(".hero-section").height() / 2) - ($(".search-form .wrapper").height() / 2));
    }
    Main.trackpadScroll("initialize");
  }

//  iCheck -------------------------------------------------------------------------------------------------------------
  
  if ($("input[type=checkbox]").length > 0 || $("input[type=radio]").length > 0) {
    require.ensure([],function (require) {
      require('icheck');
      $("input").iCheck();
    });
  }
  

//  Smooth Scroll ------------------------------------------------------------------------------------------------------
  
  $('.main-nav a[href^="#"], a[href^="#"].scroll').on('click', function (e) {
    e.preventDefault();
    var target = this.hash,
      $target = $(target);
    $('html, body').stop().animate({
      'scrollTop': $target.offset().top
    }, 2000, 'swing', function () {
      window.location.hash = target;
    });
  });

//  Modal after click --------------------------------------------------------------------------------------------------
  
  $("[data-modal-external-file], .quick-detail").on("click", function (e) {
    e.preventDefault();
    var modalTarget, modalFile;
    var _this = $(this);
    var modalItemID = _this.closest(".item").data("id");
    
    if (modalItemID) {
      modalTarget = modalItemID;
      modalFile = "modal_item.html";
    }
    else {
      modalTarget = _this.attr("data-target");
      modalFile = _this.attr("data-modal-external-file");
    }
    if (_this.attr("data-close-modal") == "true") {
      lastModal.modal("hide");
      setTimeout(function () {
        Main.openModal(modalTarget, modalFile);
      }, 400);
    }
    else {
      Main.openModal(modalTarget, modalFile);
    }
  });

//  Multiple modal hack ------------------------------------------------------------------------------------------------
  
  $(document).on('show.bs.modal', '.modal', function () {
    var zIndex = 1040 + (10 * $('.modal:visible').length);
    $(this).css('z-index', zIndex);
    setTimeout(function () {
      $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
    }, 0);
  });
  
//  Map in Row listing -------------------------------------------------------------------------------------------------
  
  $(".item.item-row").each(function () {
    var _this = $(this);
    var element = "map" + _this.data("id");
    var place;
    _this.find(".map").attr("id", element);
    var _latitude = _this.data("latitude");
    var _longitude = _this.data("longitude");
    if (_this.data("address")) {
      place = _this.data("address");
    }
    else {
      place = false;
    }
    simpleMap(_latitude, _longitude, element, false, place);
  });

//  Close "More" menu on click anywhere on page ------------------------------------------------------------------------
  
  $$('.controls-more').on("click",function (e) {
    e.preventDefault();
    $$(this).toggleClass("show");
  });

// Mobile navigation button --------------------------------------------------------------------------------------------
  
  $$(".nav-btn").on("click", function (e) {
    e.preventDefault();
    $$(this).toggleClass("active");
    $$(".primary-nav").toggleClass("show");
  });

//  Duplicate desired element ------------------------------------------------------------------------------------------
  
  $(".duplicate").on("click", function (e) {
    e.preventDefault();
    var _this = $(this);
    var duplicateElement = _this.attr("href");
    var parentElement = $(duplicateElement)[0].parentElement;
    $(parentElement).append($(duplicateElement)[0].outerHTML);
  });

//  Enable image previews in multi file input --------------------------------------------------------------------------
  
  if ($("input[type=file].with-preview").length) {
    require.ensure([],function (require) {
      require('jquery-multifile');
      $("input.file-upload-input").MultiFile({
        list: ".file-upload-previews"
      });
    });
  }

//  No UI Slider -------------------------------------------------------------------------------------------------------
  
  if ($('.ui-slider').length > 0) {
    require.ensure([],function (require) {
      require('nouislider_js');
      $('.ui-slider').each(function () {
        var _this = $(this);
        var step;
        if (_this.attr('data-step')) {
          step = parseInt(_this.attr('data-step'));
        }
        else {
          step = 10;
        }
        var sliderElement = _this.attr('id');
        var element = $('#' + sliderElement);
        var valueMin = parseInt(_this.attr('data-value-min'));
        var valueMax = parseInt(_this.attr('data-value-max'));
        _this.noUiSlider({
          start  : [
            valueMin,
            valueMax
          ],
          connect: true,
          range  : {
            'min': valueMin,
            'max': valueMax
          },
          step   : step
        });
        if (_this.attr('data-value-type') == 'price') {
          if (_this.attr('data-currency-placement') == 'before') {
            _this.Link('lower').to(_this.children('.values').children('.value-min'), null, wNumb({
              prefix  : _this.attr('data-currency'),
              decimals: 0,
              thousand: '.'
            }));
            _this.Link('upper').to(_this.children('.values').children('.value-max'), null, wNumb({
              prefix  : _this.attr('data-currency'),
              decimals: 0,
              thousand: '.'
            }));
          }
          else if (_this.attr('data-currency-placement') == 'after') {
            _this.Link('lower').to(_this.children('.values').children('.value-min'), null, wNumb({
              postfix : _this.attr('data-currency'),
              decimals: 0,
              thousand: ' '
            }));
            _this.Link('upper').to(_this.children('.values').children('.value-max'), null, wNumb({
              postfix : _this.attr('data-currency'),
              decimals: 0,
              thousand: ' '
            }));
          }
        }
        else {
          _this.Link('lower').to(_this.children('.values').children('.value-min'), null, wNumb({decimals: 0}));
          _this.Link('upper').to(_this.children('.values').children('.value-max'), null, wNumb({decimals: 0}));
        }
      });
    });
  }

//  Calendar
  
  if ($(".calendar").length) {
    
    var date = new Date();
    var month = date.getMonth();
    var calendarWrapper = $('.calendar-wrapper');
    
    require.ensure([],function (require) {
      require('zabuto_calendar_js');
      for (var i = 1; i <= 12; i++) {
        calendarWrapper.append('<div id="month_' + i + '" class="month"></div>');
        $("#month_" + i).zabuto_calendar({
          ajax         : {
            url  : "assets/php/calendar.php",
            modal: true
          },
          action       : function () {
            var date = $("#" + this.id).data("date");
            $("#modal-date").val(date);
            return checkDate(this.id);
          },
          language     : "en",
          month        : i,
          show_previous: false,
          show_next    : false,
          today        : true,
          nav_icon     : {
            prev: '<i class="arrow_left"></i>',
            next: '<i class="arrow_right"></i>'
          }
        });
      }
    });
    calendarWrapper.owlCarousel({
      items        : 2,
      nav          : true,
      autoHeight   : true,
      navText      : [],
      startPosition: month
    });
  }

//  Form Validation
  
  $(".form-email .btn[type='submit']").on("click", function () {
    var _this = $(this);
    var button = _this;
    var form = _this.closest("form");
    button.prepend("<div class='status'></div>");
    require.ensure([],function (require) {
      require('jquery-validation');
      form.validate({
        submitHandler: function () {
          $.ajax({
            url: "assets/external/email.html",
            // dataType: "json",
            method: "GET",
            success: function (response) {
              //console.log(response);
              //$('#form-subscribe .form-contact-status').html(response);
              button.find(".status").append(response);
              form.addClass("submitted");
            },
            // error: function (e) {
            //   console.log(e);
            // }
          });
          // $.post("assets/external/email.html", form.serialize(), function (response) {
          //   //console.log(response);
          //   //$('#form-subscribe .form-contact-status').html(response);
          //   button.find(".status").append(response);
          //   form.addClass("submitted");
          // });
          return false;
        }
      });
    });
  });
  
  Main.equalHeight(".container");
  Main.ratingPassive("body");
  Main.bgTransfer();
  Main.responsiveNavigation();
  Main.initializeOwl();
  Main.initializeFitVids();
  Main.rating();
  
});