const $$ = require('domtastic');
const Hooks = require("../module/hooks");
const util = require("../module/util");

function responsive_init() {
  const pageHeader = $$("#page-header");
  const pageHeaderHeight = util.getMaxHeight(pageHeader);
  const pageFooter = $$("#page-footer");
  const pageFooterHeight = util.getMaxHeight(pageFooter);
  const fullWrapper = $$(".full-height");
  const body = $$(document.body);

//  if(pageHeader.hasClass('fixed-top')){
//	  body.css({
//	  	'padding-top':pageHeaderHeight+'px',
//		  'padding-bottom':pageFooterHeight+'px'
//	  });
//  }
  
  
  if (fullWrapper.length){
    fullWrapper.css({
      'height': (window.innerHeight - pageHeaderHeight - pageFooterHeight)+'px'
    });
  }
}


Hooks.addAction("_init", responsive_init);
Hooks.addAction("pageLoader.processEnd", responsive_init);