var $$ = require('domtastic');
var viewport = require('../module/viewport');

if (viewport.isSize('xs')) {
  var hasChild = $$(".has-child");
  
  $$("body").addClass("nav-btn-only");
  hasChild.children("a").attr("data-toggle", "collapse");
  hasChild.find(".nav-wrapper").addClass("collapse");
  
  $$(".mega-menu .heading").forEach(function (element, iter) {
    var _this = $$(element);
    var elHtml = _this[0].outerHTML;
    var parent = $$(_this.parent());
    var linkCollapseID = '#mega-menu-collapse-' + iter;
    parent.prepend("<a href='" + linkCollapseID + "' class='has-child' aria-controls='" + linkCollapseID + "' data-toggle='collapse'>" + elHtml + "</a>");
    _this.remove();
    
  });
  $$(".mega-menu ul").forEach(function (element, iter) {
    var _this = $$(element);
    _this.attr("id", "mega-menu-collapse-" + iter);
    _this.addClass("collapse");
  })
}