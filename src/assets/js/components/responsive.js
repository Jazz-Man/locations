var $$ = require('domtastic');

var pageHeader = $$("#page-header");
var pageFooter = $$(".page-footer");
var fullWrapper = $$(".full-height");

if (fullWrapper.length){
  fullWrapper.css({
    'height': (window.innerHeight - pageHeader.prop('offsetHeight') - pageFooter.prop('offsetHeight'))+'px'
  });
}