require('./assets/scss/style.scss');

var bsn = require('./assets/js/lib/bootstrap.native');
var acf = require('./assets/js/lib/acf-input');
var spop = require('./assets/js/lib/spop');

spop({
  template: 'Position top left',
  position  : 'top-left',
  style: 'success'
});

acf.do_action('prepare');

var $$ = require('domtastic');

var Main = require('./assets/js/main');

$$(document).on('complete',init);

$$(document).ready(init);

function init(e) {
  
  var pageHeader = $$("#page-header");
  var pageFooter = $$("#page-footer");
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
      'height': (window.innerHeight - pageHeader[0].offsetHeight - pageFooter[0].offsetHeight)+'px'
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
  
  
  $$('.controls-more').on("click",function (e) {
    e.preventDefault();
    $$(this).toggleClass("show");
  });
  
  $$(".nav-btn").on("click", function (e) {
    e.preventDefault();
    $$(this).toggleClass("active");
    $$(".primary-nav").toggleClass("show");
  });
  
  
  Main.addListingFormInit();
  Main.inputAutoComplete();
  Main.wpas();
  Main.ratingPassive("body");
  Main.bgTransfer();
  Main.responsiveNavigation();
  Main.initializeOwl();
  Main.initializeFitVids();
  Main.rating();
}