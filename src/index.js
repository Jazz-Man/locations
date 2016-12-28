require('./assets/scss/style.scss');
var $$ = require('domtastic');

var acf = require('./assets/js/lib/acf-input');
window.acf = acf;

var Main = require('./assets/js/main');

$$(document).on('complete',init);

$$(document).ready(init);

function init(e) {
  
  var pageHeader = $$("#page-header");
  var mapWrapper = $$(".map-wrapper");
  var hasBackground = $$(".has-background");
  
  if (Main.viewport.isSize('xs')) {
  
    mapWrapper.css({
      'height': (window.innerHeight - pageHeader[0].offsetHeight)+'px'
    });
  
    hasBackground.css({
      'height': (window.innerHeight - pageHeader[0].offsetHeight)+'px'
    });
  }
  else {
    
    $$(".hero-section.full-screen").css({
      'height': (window.innerHeight - pageHeader[0].offsetHeight)+'px'
    });
  }
  
  
  if ($(".social-share").length) {
    Main.socialShare();
  }

//  iCheck -------------------------------------------------------------------------------------------------------------
  
  if ($$("input[type=checkbox]").length || $$("input[type=radio]").length) {
    require('icheck');
    $("input").iCheck();
  }


//  Smooth Scroll ------------------------------------------------------------------------------------------------------
  
  // $('.main-nav a[href^="#"], a[href^="#"].scroll').on('click', function (e) {
  //   e.preventDefault();
  //   var target = this.hash,
  //     $target = $(target);
  //   $('html, body').stop().animate({
  //     'scrollTop': $target.offset().top
  //   }, 2000, 'swing', function () {
  //     window.location.hash = target;
  //   });
  // });
  
  $$('.controls-more').on("click",function (e) {
    e.preventDefault();
    $$(this).toggleClass("show");
  });
  
  $$(".nav-btn").on("click", function (e) {
    e.preventDefault();
    $$(this).toggleClass("active");
    $$(".primary-nav").toggleClass("show");
  });
  
  if ($("input[type=file].with-preview").length) {
    require('jquery-multifile');
    $("input.file-upload-input").MultiFile({
      list: ".file-upload-previews"
    });
  }
  
  Main.addListingFormInit();
  Main.inputAutoComplete();
  Main.wpas();
  Main.equalHeight(".container");
  Main.ratingPassive("body");
  Main.bgTransfer();
  Main.responsiveNavigation();
  Main.initializeOwl();
  Main.initializeFitVids();
  Main.rating();
}