var $$ = require('domtastic');
var reqwest = require('reqwest');
var bsn = require("../lib/bootstrap.native");

var isLoad = false;
var started = false;
var ignoreUrlStr = ["#", "/wp-", ".pdf", ".zip", ".rar"];
var scrollTop = true;

var loadingCode = $$("<div id='loader' class='fade'></div>");
loadingCode.appendTo("<div class='modal-backdrop fade in'></div>");

var pageContentBox = $('#page-content');

$$(document).ready(function () {
  loadPageInit('');
});

window.onpopstate = function(event) {
  if (started === true && checkIgnore(document.location.toString()) == true) {
    loadPage(document.location.toString(), 1);
  }
};

function loadPageInit(scope) {
  $$(scope+" a").on('click',function (e) {
    loadingCode.toggleClass('in');
    e.preventDefault();
    var link = $$(this);
    var linkHref = link.attr('href');
    if (linkHref.indexOf(upages_params.homeurl)>= 0 && checkIgnore(linkHref) == true){
      e.preventDefault();
      loadPage(linkHref);
    }
  });
}

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
    pageContentBox.fadeIn("slow", function() {
      $$(document.body).append(loadingCode);
      $.ajax({
        type: "GET",
        url: url,
        data: getData,
        cache: false,
        dataType: "html",
        success: function(data) {
          isLoad = false;
          datax = data.split("<title>");
          titlesx = data.split("</title>");
          data = data.split("<title>")[1];
          titles = data.split("</title>")[0];
          $(document).attr("title", $("<div/>").html(titles).text());
          data = data.split('id="page-content"')[1];
          data = data.substring(data.indexOf(">") + 1);
          var depth = 1;
          var output = "";
          var temp;
          var pos;
          while (depth > 0) {
            temp = data.split("</div>")[0];
            i = 0;
            pos = temp.indexOf("<div");
            while (pos != -1) {
              i++;
              pos = temp.indexOf("<div", pos + 1);
            }
            depth = depth + i - 1;
            output = output + data.split("</div>")[0] + "</div>";
            data = data.substring(data.indexOf("</div>") + 6);
          }
          $$('#page-content').html(output);
          loadPageInit('#page-content');
  
          loadingCode.toggleClass('in');
          $$(document).trigger("complete");
        },
        error: function(jqXHR, textStatus, errorThrown) {
          isLoad = false;
          document.title = "Error loading requested page!";
        }
      });
    });
  }
}

/**
 * @return {boolean}
 */
function checkIgnore(url) {
  var i;
  for (i in ignoreUrlStr) {
    if (url.indexOf(ignoreUrlStr[i]) >= 0) {
      return false;
    }
  }
  return true;
}

function scrollToTop(scrollDuration) {
  var scrollStep = -window.scrollY / (scrollDuration / 15),
    scrollInterval = setInterval(function(){
      if ( window.scrollY != 0 ) {
        window.scrollBy( 0, scrollStep );
      }
      else {clearInterval(scrollInterval);}
    },15);
}