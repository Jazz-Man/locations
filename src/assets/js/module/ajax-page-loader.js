var $$ = require('domtastic');
var reqwest = require('reqwest');
var pace = require('./pace');

var doc = document;

var isLoad = false;
var started = false;
var ignoreUrlStr = [
  "#",
  "/wp-",
  ".pdf",
  ".zip",
  ".rar"
];

// console.log($$('body a'));

window.onpopstate = function (event) {
  if (started === true && checkIgnore(document.location.toString()) == true) {
    loadPage(document.location.toString(), 1);
  }
};

function loadPage(url, push, getData) {
  if (!isLoad) {
    scrollToTop(1500);
    isLoad = true;
    started = true;
    var nohttp = url.replace("http://", "").replace("https://", "");
    var firstsla = nohttp.indexOf("/");
    var pathpos = url.indexOf(nohttp);
    var path = url.substring(pathpos + firstsla);
    if (push != 1) {
      if (typeof window.history.pushState == "function") {
        var stateObj = {
          foo: 1E3 + Math.random() * 1001
        };
        history.pushState(stateObj, "ajax page loaded...", path);
      }
    }
    
    reqwest({
      url: url,
      method: 'get',
      data: getData,
      type: 'html',
      success: function (resp) {
        isLoad = false;
        var output = parseHTML(resp);
        // $$(doc.head).html(output.head);
        $$(doc.body).html(output.body);
        $$(doc).trigger("complete");
      },
      error: function (resp) {
        console.log(resp);
      }
    });
  }
}

var parseHTML = function (str) {
  var startHead = str.indexOf("<head");
  startHead = str.indexOf(">", startHead);
  var endHead = str.indexOf("</head>");
  var headString = str.slice(startHead + 1, endHead);
  
  var startBody = str.indexOf("<body");
  startBody = str.indexOf(">", startBody);
  var endBody = str.indexOf("</body>");
  var bodyString = str.slice(startBody + 1, endBody);
  
  return {
    head: headString,
    body: bodyString
  };
  
};

function checkIgnore(url) {
  var i;
  for (i in ignoreUrlStr) {
    if (url.indexOf(ignoreUrlStr[i]) >= 0) {
      return false;
    }
  }
  return true;
}

function scrollToTop(duration) {
  var sy = window.scrollY;
  var scrollStep = -sy / (
                   duration / 15);
  var scrollInterval = setInterval(function () {
    if (sy != 0) {
      window.scrollBy(0, scrollStep);
    }
    else {clearInterval(scrollInterval);}
  }, 15);
}

module.exports = {
  loadPage: loadPage,
  checkIgnore: checkIgnore
};