var $$ = require('domtastic');
var bsn = require('./bootstrap.native.js');

+function($) {
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  var _createClass = function() {
    function defineProperties(target, props) {
      var i = 0;
      for (;i < props.length;i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) {
          descriptor.writable = true;
        }
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function(Constructor, protoProps, staticProps) {
      if (protoProps) {
        defineProperties(Constructor.prototype, protoProps);
      }
      if (staticProps) {
        defineProperties(Constructor, staticProps);
      }
      return Constructor;
    };
  }();
  var Lightbox = function($) {
    var NAME = "ekkoLightbox";
    var JQUERY_NO_CONFLICT = $.fn[NAME];
    var Default = {
      title : "",
      footer : "",
      showArrows : true,
      type : null,
      alwaysShowClose : false,
      loadingMessage : '<div class="ekko-lightbox-loader"><div><div></div><div></div></div></div>',
      leftArrow : "<span>&#10094;</span>",
      rightArrow : "<span>&#10095;</span>",
      strings : {
        close : "Close",
        fail : "Failed to load image:",
        type : "Could not detect remote target type. Force the type using data-type"
      },
      doc : document,
      onShow : function onShow() {
      },
      onShown : function onShown() {
      },
      onHide : function onHide() {
      },
      onHidden : function onHidden() {
      },
      onNavigate : function onNavigate() {
      },
      onContentLoaded : function onContentLoaded() {
      }
    };
    var Lightbox$$0 = function() {
      function Lightbox($element, config) {
        var _this = this;
        _classCallCheck(this, Lightbox);
        _this._config = $.extend({}, Default, config);
        _this._$modalArrows = null;
        _this._galleryIndex = 0;
        _this._galleryName = null;
        _this._padding = null;
        _this._border = null;
        _this._titleIsShown = false;
        _this._footerIsShown = false;
        _this._wantedWidth = 0;
        _this._wantedHeight = 0;
        _this._modalId = "ekkoLightbox-" + Math.floor(Math.random() * 1E3 + 1);
        _this._$element = $element instanceof jQuery ? $element : $($element);
        var header = '<div class="modal-header"' + (_this._config.title || this._config.alwaysShowClose ? "" : ' style="display:none"') + '><button type="button" class="close" data-dismiss="modal" aria-label="' + _this._config.strings.close + '"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">' + (_this._config.title || "&nbsp;") + "</h4></div>";
        var footer = '<div class="modal-footer"' + (_this._config.footer ? "" : ' style="display:none"') + ">" + (_this._config.footer || "&nbsp;") + "</div>";
        var body = '<div class="modal-body"><div class="ekko-lightbox-container"><div class="ekko-lightbox-item fade in"></div><div class="ekko-lightbox-item fade"></div></div></div>';
        var dialog = '<div class="modal-dialog" role="document"><div class="modal-content">' + header + body + footer + "</div></div>";
        $(_this._config.doc.body).append('<div id="' + _this._modalId + '" class="ekko-lightbox modal fade" tabindex="-1" tabindex="-1" role="dialog" aria-hidden="true">' + dialog + "</div>");
        _this._$modal = $("#" + _this._modalId, _this._config.doc);
        _this._$modalDialog = _this._$modal.find(".modal-dialog").first();
        _this._$modalContent = _this._$modal.find(".modal-content").first();
        _this._$modalBody = _this._$modal.find(".modal-body").first();
        _this._$modalHeader = _this._$modal.find(".modal-header").first();
        _this._$modalFooter = _this._$modal.find(".modal-footer").first();
        _this._$lightboxContainer = _this._$modalBody.find(".ekko-lightbox-container").first();
        _this._$lightboxBodyOne = _this._$lightboxContainer.find("> div:first-child").first();
        _this._$lightboxBodyTwo = _this._$lightboxContainer.find("> div:last-child").first();
        _this._border = this._calculateBorders();
        _this._padding = this._calculatePadding();
        _this._galleryName = this._$element.data("gallery");
        if (this._galleryName) {
          _this._$galleryItems = $(document.body).find('*[data-gallery="' + this._galleryName + '"]');
          _this._galleryIndex = _this._$galleryItems.index(_this._$element);
          $(document).on("keydown.ekkoLightbox", this._navigationalBinder.bind(this));
          if (_this._config.showArrows && _this._$galleryItems.length > 1) {
            _this._$lightboxContainer.append('<div class="ekko-lightbox-nav-overlay"><a href="#">' + _this._config.leftArrow + '</a><a href="#">' + _this._config.rightArrow + "</a></div>");
            _this._$modalArrows = _this._$lightboxContainer.find("div.ekko-lightbox-nav-overlay").first();
            _this._$lightboxContainer.on("click", "a:first-child", function(event) {
              event.preventDefault();
              return _this.navigateLeft();
            });
            _this._$lightboxContainer.on("click", "a:last-child", function(event) {
              event.preventDefault();
              return _this.navigateRight();
            });
          }
        }
        _this._$modal.on("show.bs.modal", _this._config.onShow.bind(this)).on("shown.bs.modal", function() {
          _this._toggleLoading(true);
          _this._handle();
          return _this._config.onShown.call(_this);
        }).on("hide.bs.modal", _this._config.onHide.bind(this)).on("hidden.bs.modal", function() {
          if (_this._galleryName) {
            $(document).off("keydown.ekkoLightbox");
            $(window).off("resize.ekkoLightbox");
          }
          _this._$modal.remove();
          return _this._config.onHidden.call(_this);
        }).modal(_this._config);
        $(window).on("resize.ekkoLightbox", function() {
          _this._resize(_this._wantedWidth, _this._wantedHeight);
        });
      }
      _createClass(Lightbox, null, [{
        key : "Default",
        get : function get() {
          return Default;
        }
      }]);
      _createClass(Lightbox, [{
        key : "element",
        value : function element() {
          return this._$element;
        }
      }, {
        key : "modal",
        value : function modal() {
          return this._$modal;
        }
      }, {
        key : "navigateTo",
        value : function navigateTo(index) {
          var _this = this;
          if (index < 0 || index > this._$galleryItems.length - 1) {
            return this;
          }
          _this._galleryIndex = index;
          _this._$element = $(this._$galleryItems.get(_this._galleryIndex));
          _this._handle();
        }
      }, {
        key : "navigateLeft",
        value : function navigateLeft() {
          var _this = this;
          if (_this._$galleryItems.length === 1) {
            return;
          }
          if (_this._galleryIndex === 0) {
            _this._galleryIndex = _this._$galleryItems.length - 1;
          } else {
            _this._galleryIndex--;
          }
          _this._config.onNavigate.call(_this, "left", _this._galleryIndex);
          return _this.navigateTo(this._galleryIndex);
        }
      }, {
        key : "navigateRight",
        value : function navigateRight() {
          var _this = this;
          if (_this._$galleryItems.length === 1) {
            return;
          }
          if (_this._galleryIndex === _this._$galleryItems.length - 1) {
            _this._galleryIndex = 0;
          } else {
            _this._galleryIndex++;
          }
          _this._config.onNavigate.call(this, "right", this._galleryIndex);
          return _this.navigateTo(_this._galleryIndex);
        }
      }, {
        key : "close",
        value : function close() {
          return this._$modal.modal("hide");
        }
      }, {
        key : "_navigationalBinder",
        value : function _navigationalBinder(event) {
          event = event || window.event;
          if (event.keyCode === 39) {
            return this.navigateRight();
          }
          if (event.keyCode === 37) {
            return this.navigateLeft();
          }
        }
      }, {
        key : "_detectRemoteType",
        value : function _detectRemoteType(src, type) {
          type = type || false;
          if (!type && this._isImage(src)) {
            type = "image";
          }
          if (!type && this._getYoutubeId(src)) {
            type = "youtube";
          }
          if (!type && this._getVimeoId(src)) {
            type = "vimeo";
          }
          if (!type && this._getInstagramId(src)) {
            type = "instagram";
          }
          if (!type || ["image", "youtube", "vimeo", "instagram", "video", "url"].indexOf(type) < 0) {
            type = "url";
          }
          return type;
        }
      }, {
        key : "_isImage",
        value : function _isImage(string) {
          return string && string.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i);
        }
      }, {
        key : "_containerToUse",
        value : function _containerToUse() {
          var _this2 = this;
          var $toUse = _this2._$lightboxBodyTwo;
          var $current = _this2._$lightboxBodyOne;
          if (_this2._$lightboxBodyTwo.hasClass("in")) {
            $toUse = _this2._$lightboxBodyOne;
            $current = _this2._$lightboxBodyTwo;
          }
          $current.removeClass("in");
          setTimeout(function() {
            if (!_this2._$lightboxBodyTwo.hasClass("in")) {
              _this2._$lightboxBodyTwo.empty();
            }
            if (!_this2._$lightboxBodyOne.hasClass("in")) {
              _this2._$lightboxBodyOne.empty();
            }
          }, 500);
          $toUse.addClass("in");
          return $toUse;
        }
      }, {
        key : "_handle",
        value : function _handle() {
          var _this = this;
          var $toUse = _this._containerToUse();
          _this._updateTitleAndFooter();
          var currentRemote = _this._$element.attr("data-remote") || _this._$element.attr("href");
          var currentType = _this._detectRemoteType(currentRemote, _this._$element.attr("data-type") || false);
          if (["image", "youtube", "vimeo", "instagram", "video", "url"].indexOf(currentType) < 0) {
            return _this._error(_this._config.strings.type);
          }
          switch(currentType) {
            case "image":
              _this._preloadImage(currentRemote, $toUse);
              _this._preloadImageByIndex(_this._galleryIndex, 3);
              break;
            case "youtube":
              _this._showYoutubeVideo(currentRemote, $toUse);
              break;
            case "vimeo":
              _this._showVimeoVideo(_this._getVimeoId(currentRemote), $toUse);
              break;
            case "instagram":
              _this._showInstagramVideo(_this._getInstagramId(currentRemote), $toUse);
              break;
            case "video":
              _this._showHtml5Video(currentRemote, $toUse);
              break;
            default:
              _this._loadRemoteContent(currentRemote, $toUse);
              break;
          }
          return this;
        }
      }, {
        key : "_getYoutubeId",
        value : function _getYoutubeId(string) {
          if (!string) {
            return false;
          }
          var matches = string.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
          return matches && matches[2].length === 11 ? matches[2] : false;
        }
      }, {
        key : "_getVimeoId",
        value : function _getVimeoId(string) {
          return string && string.indexOf("vimeo") > 0 ? string : false;
        }
      }, {
        key : "_getInstagramId",
        value : function _getInstagramId(string) {
          return string && string.indexOf("instagram") > 0 ? string : false;
        }
      }, {
        key : "_toggleLoading",
        value : function _toggleLoading(show) {
          var _this = this;
          show = show || false;
          if (show) {
            _this._$modalDialog.css("display", "none");
            _this._$modal.removeClass("in");
            $(".modal-backdrop").append(this._config.loadingMessage);
          } else {
            _this._$modalDialog.css("display", "block");
            _this._$modal.addClass("in");
            $(".modal-backdrop").find(".ekko-lightbox-loader").remove();
          }
          return this;
        }
      }, {
        key : "_calculateBorders",
        value : function _calculateBorders() {
          var _this = this;
          return{
            top : _this._totalCssByAttribute("border-top-width"),
            right : _this._totalCssByAttribute("border-right-width"),
            bottom : _this._totalCssByAttribute("border-bottom-width"),
            left : _this._totalCssByAttribute("border-left-width")
          };
        }
      }, {
        key : "_calculatePadding",
        value : function _calculatePadding() {
          var _this = this;
          return{
            top : _this._totalCssByAttribute("padding-top"),
            right : _this._totalCssByAttribute("padding-right"),
            bottom : _this._totalCssByAttribute("padding-bottom"),
            left : _this._totalCssByAttribute("padding-left")
          };
        }
      }, {
        key : "_totalCssByAttribute",
        value : function _totalCssByAttribute(attribute) {
          var _this = this;
          return parseInt(_this._$modalDialog.css(attribute), 10) + parseInt(_this._$modalContent.css(attribute), 10) + parseInt(_this._$modalBody.css(attribute), 10);
        }
      }, {
        key : "_updateTitleAndFooter",
        value : function _updateTitleAndFooter() {
          var _this = this;
          var title = _this._$element.data("title") || "";
          var caption = _this._$element.data("footer") || "";
          _this._titleIsShown = false;
          if (title || _this._config.alwaysShowClose) {
            _this._titleIsShown = true;
            _this._$modalHeader.css("display", "").find(".modal-title").html(title || "&nbsp;");
          } else {
            _this._$modalHeader.css("display", "none");
          }
          _this._footerIsShown = false;
          if (caption) {
            _this._footerIsShown = true;
            _this._$modalFooter.css("display", "").html(caption);
          } else {
            _this._$modalFooter.css("display", "none");
          }
          return this;
        }
      }, {
        key : "_showYoutubeVideo",
        value : function _showYoutubeVideo(remote, $containerForElement) {
          var _this = this;
          var id = _this._getYoutubeId(remote);
          var query = remote.indexOf("&") > 0 ? remote.substr(remote.indexOf("&")) : "";
          var width = _this._$element.data("width") || 560;
          var height = _this._$element.data("height") || width / (560 / 315);
          return _this._showVideoIframe("//www.youtube.com/embed/" + id + "?badge=0&autoplay=1&html5=1" + query, width, height, $containerForElement);
        }
      }, {
        key : "_showVimeoVideo",
        value : function _showVimeoVideo(id, $containerForElement) {
          var _this = this;
          var width = 500;
          var height = _this._$element.data("height") || width / (560 / 315);
          return _this._showVideoIframe(id + "?autoplay=1", width, height, $containerForElement);
        }
      }, {
        key : "_showInstagramVideo",
        value : function _showInstagramVideo(id, $containerForElement) {
          var _this = this;
          var width = _this._$element.data("width") || 612;
          var height = width + 80;
          id = id.substr(-1) !== "/" ? id + "/" : id;
          $containerForElement.html('<iframe width="' + width + '" height="' + height + '" src="' + id + 'embed/" frameborder="0" allowfullscreen></iframe>');
          _this._resize(width, height);
          _this._config.onContentLoaded.call(this);
          if (_this._$modalArrows) {
            _this._$modalArrows.css("display", "none");
          }
          _this._toggleLoading(false);
          return _this;
        }
      }, {
        key : "_showVideoIframe",
        value : function _showVideoIframe(url, width, height, $containerForElement) {
          var _this = this;
          height = height || width;
          $containerForElement.html('<div class="embed-responsive embed-responsive-16by9"><iframe width="' + width + '" height="' + height + '" src="' + url + '" frameborder="0" allowfullscreen class="embed-responsive-item"></iframe></div>');
          _this._resize(width, height);
          _this._config.onContentLoaded.call(this);
          if (_this._$modalArrows) {
            _this._$modalArrows.css("display", "none");
          }
          _this._toggleLoading(false);
          return _this;
        }
      }, {
        key : "_showHtml5Video",
        value : function _showHtml5Video(url, $containerForElement) {
          var _this = this;
          var width = _this._$element.data("width") || 560;
          var height = _this._$element.data("height") || width / (560 / 315);
          $containerForElement.html('<div class="embed-responsive embed-responsive-16by9"><video width="' + width + '" height="' + height + '" src="' + url + '" preload="auto" autoplay controls class="embed-responsive-item"></video></div>');
          _this._resize(width, height);
          _this._config.onContentLoaded.call(this);
          if (_this._$modalArrows) {
            _this._$modalArrows.css("display", "none");
          }
          _this._toggleLoading(false);
          return _this;
        }
      }, {
        key : "_loadRemoteContent",
        value : function _loadRemoteContent(url, $containerForElement) {
          var _this = this;
          var width = _this._$element.data("width") || 560;
          var height = _this._$element.data("height") || 560;
          var disableExternalCheck = _this._$element.data("disableExternalCheck") || false;
          _this._toggleLoading(false);
          if (!disableExternalCheck && !_this._isExternal(url)) {
            $containerForElement.load(url, $.proxy(function() {
              return _this._$element.trigger("loaded.bs.modal");
              l;
            }));
          } else {
            $containerForElement.html('<iframe src="' + url + '" frameborder="0" allowfullscreen></iframe>');
            _this._config.onContentLoaded.call(this);
          }
          if (_this._$modalArrows) {
            _this._$modalArrows.css("display", "none");
          }
          _this._resize(width, height);
          return _this;
        }
      }, {
        key : "_isExternal",
        value : function _isExternal(url) {
          var match = url.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
          if (typeof match[1] === "string" && (match[1].length > 0 && match[1].toLowerCase() !== location.protocol)) {
            return true;
          }
          if (typeof match[2] === "string" && (match[2].length > 0 && match[2].replace(new RegExp(":(" + {
                "http:" : 80,
                "https:" : 443
              }[location.protocol] + ")?$"), "") !== location.host)) {
            return true;
          }
          return false;
        }
      }, {
        key : "_error",
        value : function _error(message) {
          var _this = this;
          console.error(message);
          _this._containerToUse().html(message);
          _this._resize(300, 300);
          return _this;
        }
      }, {
        key : "_preloadImageByIndex",
        value : function _preloadImageByIndex(startIndex, numberOfTimes) {
          var _this = this;
          if (!_this._$galleryItems) {
            return;
          }
          var next = $(_this._$galleryItems.get(startIndex), false);
          if (typeof next == "undefined") {
            return;
          }
          var src = next.attr("data-remote") || next.attr("href");
          if (next.attr("data-type") === "image" || _this._isImage(src)) {
            _this._preloadImage(src, false);
          }
          if (numberOfTimes > 0) {
            return _this._preloadImageByIndex(startIndex + 1, numberOfTimes - 1);
          }
        }
      }, {
        key : "_preloadImage",
        value : function _preloadImage(src, $containerForImage) {
          var _this = this;
          $containerForImage = $containerForImage || false;
          var img = new Image;
          if ($containerForImage) {
            (function() {
              var loadingTimeout = setTimeout(function() {
                $containerForImage.append(_this._config.loadingMessage);
              }, 200);
              img.onload = function() {
                if (loadingTimeout) {
                  clearTimeout(loadingTimeout);
                }
                loadingTimeout = null;
                var image = $("<img />");
                image.attr("src", img.src);
                image.addClass("img-fluid");
                $containerForImage.html(image);
                if (_this._$modalArrows) {
                  _this._$modalArrows.css("display", "");
                }
                _this._resize(img.width, img.height);
                _this._toggleLoading(false);
                return _this._config.onContentLoaded.call(_this);
              };
              img.onerror = function() {
                _this._toggleLoading(false);
                return _this._error(_this._config.strings.fail + ("  " + src));
              };
            })();
          }
          img.src = src;
          return img;
        }
      }, {
        key : "_resize",
        value : function _resize(width, height) {
          var _this = this;
          height = height || width;
          _this._wantedWidth = width;
          _this._wantedHeight = height;
          var widthBorderAndPadding = _this._padding.left + _this._padding.right + _this._border.left + _this._border.right;
          var maxWidth = Math.min(width + widthBorderAndPadding, _this._config.doc.body.clientWidth);
          if (width + widthBorderAndPadding > maxWidth) {
            height = (maxWidth - widthBorderAndPadding) / width * height;
            width = maxWidth;
          } else {
            width = width + widthBorderAndPadding;
          }
          var headerHeight = 0;
          var footerHeight = 0;
          if (_this._footerIsShown) {
            footerHeight = _this._$modalFooter.outerHeight(true) || 55;
          }
          if (_this._titleIsShown) {
            headerHeight = _this._$modalHeader.outerHeight(true) || 67;
          }
          var borderPadding = _this._padding.top + _this._padding.bottom + _this._border.bottom + _this._border.top;
          var margins = parseFloat(_this._$modalDialog.css("margin-top")) + parseFloat(_this._$modalDialog.css("margin-bottom"));
          var maxHeight = Math.min(height, $(window).height() - borderPadding - margins - headerHeight - footerHeight);
          if (height > maxHeight) {
            var factor = Math.min(maxHeight / height, 1);
            width = Math.ceil(factor * width);
          }
          _this._$lightboxContainer.css("height", maxHeight);
          _this._$modalDialog.css("width", "auto").css("maxWidth", width);
          _this._$modal.modal("_handleUpdate");
          return _this;
        }
      }], [{
        key : "_jQueryInterface",
        value : function _jQueryInterface(config) {
          var _this5 = this;
          config = config || {};
          return this.each(function() {
            var $this = $(_this5);
            var _config = $.extend({}, Lightbox.Default, $this.data(), typeof config === "object" && config);
            new Lightbox(_this5, _config);
          });
        }
      }]);
      return Lightbox;
    }();
    $.fn[NAME] = Lightbox$$0._jQueryInterface;
    $.fn[NAME].Constructor = Lightbox$$0;
    $.fn[NAME].noConflict = function() {
      $.fn[NAME] = JQUERY_NO_CONFLICT;
      return Lightbox$$0._jQueryInterface;
    };
    return Lightbox$$0;
  }(jQuery);
}(jQuery);
