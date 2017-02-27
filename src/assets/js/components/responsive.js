var $$ = require('domtastic');
var Hooks = require("../module/hooks");

function responsive_init() {
  var pageHeader = $$("#page-header");
  var pageFooter = $$(".page-footer");
  var fullWrapper = $$(".full-height");
  
  if (fullWrapper.length){
    fullWrapper.css({
      'height': (window.innerHeight - pageHeader.prop('offsetHeight') - pageFooter.prop('offsetHeight'))+'px'
    });
  }
}


Hooks.addAction("init", responsive_init);
Hooks.addAction("pageLoader.processEnd", responsive_init);