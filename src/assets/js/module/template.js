var template = require('lodash/template');
var memoize = require('lodash/memoize');
var $$ = require('domtastic');

module.exports = memoize(function (id, data) {
  var tpl = $$('#tmpl-' + id).html();
  options = {
    evaluate: /<#([\s\S]+?)#>/g,
    interpolate: /\{\{\{([\s\S]+?)\}\}\}/g,
    escape: /\{\{([^\}]+?)\}\}(?!\})/g,
    variable: 'data'
  };
  var compiled = template(tpl, options);
  return compiled(data);
});