require('./../scss/style.scss');
var $$ = require('domtastic');
require('./module/viewport');
// var acf = require('./lib/acf-input');
var Hooks = require('./module/hooks');
// var spop = require('./module/spop');
var doc = $$(document);

require('./module/ajaxloader')();

doc.on('complete', init);

doc.ready(init);

function init(e) {
  
  require('./components/responsive');

  require('./components/wpas');
//   // require('./components/map-simple');
  require('./module/fitvids');
//   // require('./components/rating');
//   // require('./components/add-listing-form');
  
  Hooks.doAction('init');
}