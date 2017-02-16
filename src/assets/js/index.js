require('./../scss/style.scss');

// var $$ = require('domtastic');
// var bsn = require('./module/bootstrap.native.js');
// var acf = require('./lib/acf-input');
// var spop = require('./module/spop');
// var doc = $$(document);

// var apl = require('./module/ajax-page-loader');

// acf.do_action('prepare');

// var Main = require('./main/index');

// doc.on('complete',init);

// doc.ready(init);

// function init(e) {
//
//   var links = doc.prop('links');
//   $$(links).forEach(function (e) {
//     var _this = $$(e);
//     var linkHref = _this.attr('href');
//     _this.on('click', function (e) {
//       if (linkHref.indexOf(upages_params.homeurl) >= 0 && apl.checkIgnore(linkHref) == true) {
//         e.preventDefault();
//         apl.loadPage(linkHref);
//       }
//     });
//   });
//
//
// //  iCheck -------------------------------------------------------------------------------------------------------------
//
//   if ($$(".checkboxes input[type=checkbox]").length || $$(".checkboxes input[type=radio]").length) {
//     require('icheck');
//     $("input").iCheck();
//   }
//
//
//   $$('.controls-more').on("click",function (e) {
//     e.preventDefault();
//     $$(this).toggleClass("show");
//   });
//
//   $$(".nav-btn").on("click", function (e) {
//     e.preventDefault();
//     $$(this).toggleClass("active");
//     $$(".primary-nav").toggleClass("show");
//   });
//
//
//   // require('./components/social-share');
//   // require('./components/responsive');
//   // require('./components/navigation');
//   // require('./components/wpas');
//   // require('./components/map-simple');
//   // require('./components/bg-transfer');
//   // require('./module/fitvids');
//   // Main.initializeOwl();
//   // require('./components/rating');
//   // require('./components/add-listing-form');
// }