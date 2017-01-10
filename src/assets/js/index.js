require('./../scss/style.scss');

var bsn = require('./module/bootstrap.native.js');
var acf = require('./lib/acf-input');
var spop = require('./module/spop');

acf.do_action('prepare');

var $$ = require('domtastic');

var Main = require('./main/index');

$$(document).on('complete',init);

$$(document).ready(init);

function init(e) {
  
  if ($(".social-share").length) {
    Main.socialShare();
  }

//  iCheck -------------------------------------------------------------------------------------------------------------
  
  if ($$(".checkboxes input[type=checkbox]").length || $$(".checkboxes input[type=radio]").length) {
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
  require('./components/responsive');
  require('./components/navigation');
  require('./components/input-auto-complete');
  require('./components/wpas');
  require('./components/map-simple');
  require('./components/bg-transfer');
  require('./module/fitvids');
  // require('./module/lightbox');
  // Main.ratingPassive("body");
  Main.initializeOwl();
  // Main.rating();
  require('./components/rating');
  require('./components/add-listing-form');
}