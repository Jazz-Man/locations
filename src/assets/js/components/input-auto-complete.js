var $$ = require('domtastic');
var autoComplete = require('../module/autoComplete');

var inputs = $$('input[type="text"]');
if (inputs.length) {
  inputs.forEach(function (e) {
    var _this = $$(e);
    var dataSource = _this.attr('data-auto-complete');
    if (dataSource) {
      new autoComplete({
        selector: e,
        minChars: 1,
        source: function (term, suggest) {
          term = term.toLowerCase();
          var choices = JSON.parse(dataSource);
          var suggestions = [];
          
          choices.forEach(function (e) {
            if (~e.toLowerCase().indexOf(term)) {
              suggestions.push(e);
            }
          });
          suggest(suggestions);
        }
      });
    }
  });
}