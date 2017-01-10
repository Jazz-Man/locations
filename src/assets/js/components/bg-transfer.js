var $$ = require('domtastic');
var bgTransfer = $$(".bg-transfer");

if (bgTransfer.length){
  bgTransfer.forEach(function (element) {
    var _this = $$(element);
    var backgroundImage = _this.attr("data-bg");
    if (backgroundImage) {
      _this.css("background-image", "url(" + backgroundImage + ")");
    }
    else {
      var img = _this.find('img');
      img.css('display', 'none');
      _this.css("background-image", "url(" + img.attr("src") + ")");
    }
  });
}