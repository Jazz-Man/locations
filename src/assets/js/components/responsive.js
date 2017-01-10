var $$ = require('domtastic');
var viewport = require('../module/viewport');

var pageHeader = $$("#page-header");
var pageFooter = $$("#page-footer");
var mapWrapper = $$(".map-wrapper");
var hasBackground = $$(".has-background");

if (viewport.isSize('xs')) {
  
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