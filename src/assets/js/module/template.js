var $$ = require('domtastic');

module.exports = function (id, data) {

  var tpl = $$('#tmpl-' + id).html();
  var options = {
    evaluate: /<#([\s\S]+?)#>/g,
    interpolate: /\{\{\{([\s\S]+?)\}\}\}/g,
    escape: /\{\{([^\}]+?)\}\}(?!\})/g,
    variable: 'data'
  };

  var template = require('lodash/template');
  var compiled = template(tpl, options);
  
  return compiled(data);

};