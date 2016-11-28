var is = require('is_js');

var ArrayProto = Array.prototype,
    ObjProto = Object.prototype,
    FuncProto = Function.prototype,
    slice = ArrayProto.slice,
    unshift = ArrayProto.unshift,
    toString = ObjProto.toString,
    hasOwnProperty = ObjProto.hasOwnProperty,
    nativeForEach = ArrayProto.forEach,
    nativeMap = ArrayProto.map,
    nativeReduce = ArrayProto.reduce,
    nativeReduceRight = ArrayProto.reduceRight,
    nativeFilter = ArrayProto.filter,
    nativeEvery = ArrayProto.every,
    nativeSome = ArrayProto.some,
    nativeIndexOf = ArrayProto.indexOf,
    nativeLastIndexOf = ArrayProto.lastIndexOf,
    nativeIsArray = Array.isArray,
    nativeKeys = Object.keys,
    nativeBind = FuncProto.bind,
    breaker = {};

var Main = {
    viewport: {
        viewPorts: [
            'xs',
            'sm',
            'md',
            'lg'
        ],
        viewPortSize: function () {
            return window.getComputedStyle(document.body, ':before')
                .content.replace(/"/g, '');
        },
        is: function (size) {
            if (this.viewPorts.indexOf(size) == -1) {
                throw "no valid viewport name given";
            }
            return this.viewPortSize() == size;
        },
        isEqualOrGreaterThan: function (size) {
            if (this.viewPorts.indexOf(size) == -1) {
                throw "no valid viewport name given";
            }
            return this.viewPorts.indexOf(this.viewPortSize()) >= this.viewPorts.indexOf(size);
        },
    },
    ajax: {
        settings: {},
        post: function (action, data) {
            return this.ajax.send({
                data: is.object(action) ? action : this.extend(data || {}, {
                    action: action
                })
            });
        },
        send: function (action, options) {
            var promise, deferred;
            if (is.object(action)) {
                options = action;
            } else {
                options = options || {};
                options.data = this.extend(options.data || {}, {
                    action: action
                });
            }

            options = this.defaults(options || {}, {
                type: 'POST',
                url: this.ajax.settings.url,
                context: this
            });

            deferred = $.Deferred(function (deferred) {
                // Transfer success/error callbacks.
                if (options.success) {
                    deferred.done(options.success);
                }
                if (options.error) {
                    deferred.fail(options.error);
                }

                delete options.success;
                delete options.error;

                deferred.jqXHR = $.ajax(options)
                    .done(function (response) {
                        if (response === '1' || response === 1) {
                            response = {
                                success: true
                            };
                        }
                        if (is.object(response) && !is.undefined(response.success)) {
                            deferred[response.success ? 'resolveWith' : 'rejectWith'](this, [response.data]);
                        } else {
                            deferred.rejectWith(this, [response]);
                        }
                    })
                    .fail(function () {
                        deferred.rejectWith(this, arguments);
                    });
            });

            promise = deferred.promise();
            promise.abort = function () {
                deferred.jqXHR.abort();
                return this;
            };

            return promise;
        }
    },
    extend: function (obj) {
        this.each(slice.call(arguments, 1), function (source) {
            for (var prop in source) {
                obj[prop] = source[prop];
            }
        });
        return obj;
    },
    each: function (obj, iterator, context) {
        if (is.null(obj)) {
            return;
        }
        if (nativeForEach && obj.forEach === nativeForEach) {
            obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
            for (var i = 0, l = obj.length; i < l; i++) {
                if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) {
                    return;
                }
            }
        } else {
            for (var key in obj) {
                if (this.has(obj, key)) {
                    if (iterator.call(context, obj[key], key, obj) === breaker) {
                        return;
                    }
                }
            }
        }
    },
    has: function (obj, key) {
        return hasOwnProperty.call(obj, key);
    },
    defaults: function (obj) {
        this.each(slice.call(arguments, 1), function (source) {
            for (var prop in source) {
                if (obj[prop] == null) {
                    obj[prop] = source[prop];
                }
            }
        });
        return obj;

    },
    openModal: function (target, modalPath) {
        var MAIN = this;
        $("body")
            .append('<div class="modal modal-external fade" ' +
                'id="' + target + '" ' +
                'tabindex="-1" ' +
                'role="dialog" ' +
                'aria-labelledby="' + target + '">' +
                '<i class="loading-icon fa fa-circle-o-notch fa-spin"></i>' +
                '</div>');

        $("#" + target + ".modal").on("show.bs.modal", function () {
                var _this = $(this);
                lastModal = _this;
                $.ajax({
                    url: "assets/external/" + modalPath,
                    method: "POST",
                    //dataType: "html",
                    data: {
                        id: target
                    },
                    success: function (results) {
                        _this.append(results);
                        $(".selectpicker")
                            .selectpicker();
                        _this.find(".gallery")
                            .addClass("owl-carousel");
                        MAIN.ratingPassive(".modal");
                        var img = _this.find(".gallery img:first")[0];
                        if (img) {
                            $(img)
                                .load(function () {
                                    MAIN.timeOutActions(_this);
                                });
                        } else {
                            MAIN.timeOutActions(_this);
                        }
                        MAIN.socialShare();
                        _this.on("hidden.bs.modal", function () {
                            $(lastClickedMarker)
                                .removeClass("active");
                            $(".pac-container")
                                .remove();
                            _this.remove();
                        });
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });

            });

        $("#" + target + ".modal").modal("show");

    },
    bgTransfer: function () {
        $(".bg-transfer")
            .each(function () {
                var _this = $(this);
                var backgroundImage = _this.find("img")
                    .attr("src");
                _this.css("background-image", "url(" + backgroundImage + ")");
            });
    },
    ratingPassive: function (element) {
        $(element)
            .find(".rating-passive")
            .each(function () {
                var _this = $(this);
                for (var i = 0; i < 5; i++) {
                    if (i < _this.attr("data-rating")) {
                        $(this)
                            .find(".stars")
                            .append("<figure class='active fa fa-star'></figure>")
                    } else {
                        _this.find(".stars")
                            .append("<figure class='fa fa-star'></figure>")
                    }
                }
            });
    },
    socialShare: function () {
        var socialButtonsEnabled = 1;
        if (socialButtonsEnabled == 1) {
            var headBox = $('head');
            headBox.append($('<link rel="stylesheet" type="text/css">')
                .attr('href', 'assets/css/jssocials.css'));
            headBox.append($('<link rel="stylesheet" type="text/css">')
                .attr('href', 'assets/css/jssocials-theme-minima.css'));

            $.getScript("assets/js/jssocials.min.js", function (data, textStatus, jqxhr) {
                $(".social-share")
                    .jsSocials({
                        shares: [
                            "twitter",
                            "facebook",
                            "googleplus",
                            "linkedin",
                            "pinterest"
                        ]
                    });
            });
        }
    },
    initializeFitVids: function () {
        if ($(".video")
            .length > 0) {
            $(".video")
                .fitVids();
        }
    },
    initializeOwl: function () {
        if ($(".owl-carousel").length) {
            $(".owl-carousel").each(function () {
              var _this = $(this);
              var items = parseInt(_this.data("owl-items"), 10);
              if (!items) {
                items = 1;
              }
              var nav = parseInt(_this.data("owl-nav"), 2);
              if (!nav) {
                nav = 0;
              }
              var dots = parseInt(_this.data("owl-dots"), 2);
              if (!dots) {
                dots = 0;
              }
              var center = parseInt(_this.data("owl-center"), 2);
              if (!center) {
                center = 0;
              }
              
              var loop = parseInt(_this.data("owl-loop"), 2);
                    
              if (!loop) {
                loop = 0;
              }
              var margin = parseInt(_this.data("owl-margin"), 2);
              if (!margin) {
                margin = 0;
              }
              var autoWidth = parseInt(_this.data("owl-auto-width"), 2);
              if (!autoWidth) {
                autoWidth = 0;
              }
              var navContainer = _this.data("owl-nav-container");
              if (!navContainer) {
                navContainer = 0;
              }
              var autoplay = _this.data("owl-autoplay");
              if (!autoplay) {
                autoplay = 0;
              }
              var fadeOut = _this.data("owl-fadeout");
              if (!fadeOut) {
                fadeOut = 0;
              } else {
                fadeOut = "fadeOut";
              }
              _this.owlCarousel({
                navContainer: navContainer,
                animateOut: fadeOut,
                autoplaySpeed: 2000,
                autoplay: autoplay,
                autoheight: 1,
                center: center,
                loop: loop,
                margin: margin,
                autoWidth: autoWidth,
                items: items,
                nav: nav,
                dots: dots,
                autoHeight: true,
                navText: []
              });
            });
        }
    },
    initOwl:function (selector,option) {
      
    },
    trackpadScroll: function (method) {
      require.ensure([],function (require) {
        var scrollableBox = $(".tse-scrollable");
        var resultsWrapper = $(".results-wrapper");
        var resultsWrapperResults = resultsWrapper.find('.results');
        var resultsWrapperForm = resultsWrapper.find("form");
        
        require('trackpad-scroll-js');
        
        switch (method){
          case "initialize":
            if (resultsWrapperForm.length) {
              resultsWrapperResults.height(resultsWrapper.height() - resultsWrapper.find('.form')[0].clientHeight);
            }
            breaker;
          case "recalculate":
            setTimeout(function () {
              if (scrollableBox.length) {
                scrollableBox.TrackpadScrollEmulator("recalculate");
              }
            }, 1000);
            breaker;
          default:
            if (scrollableBox.length > 0){
              scrollableBox.TrackpadScrollEmulator();
            }
        }
      });
    },
    doneResizing: function () {
        var $equalHeight = $('.container');
        for (var i = 0; i < $equalHeight.length; i++) {
            equalHeight($equalHeight);
        }
        this.responsiveNavigation()
    },
    responsiveNavigation: function () {
        if (this.viewport.is('xs')) {
            $("body").addClass("nav-btn-only");
        }
        if ($("body").hasClass("nav-btn-only")) {
          var hasChild = $(".has-child");
          hasChild.children("a").attr("data-toggle", "collapse");
          hasChild.find(".nav-wrapper").addClass("collapse");
            $(".mega-menu .heading").each(function (e) {
              var _this = $(this);
              _this.wrap("<a href='#mega-menu-collapse-" + e + "'></a>");
              _this.parent().attr("data-toggle", "collapse");
              _this.parent().addClass("has-child");
              _this.parent().attr("aria-controls", "mega-menu-collapse-" + e);
                });
            $(".mega-menu ul").each(function (e) {
              var _this = $(this);
              _this.attr("id", "mega-menu-collapse-" + e);
              _this.addClass("collapse");
            });
        }
    },
    equalHeight: function (container) {
        if (!this.viewport.is('xs')) {
            var currentTallest = 0,
                currentRowStart = 0,
                rowDivs = new Array(),
                $el,
                topPosition = 0;
          $(container).find('.equal-height').each(function () {
            $el = $(this);
            $($el).height('auto');
            topPostion = $el.position().top;
            if (currentRowStart != topPostion) {
              for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
                rowDivs[currentDiv].height(currentTallest);
              }
              rowDivs.length = 0; // empty the array
              currentRowStart = topPostion;
              currentTallest = $el.height();
              rowDivs.push($el);
            } else {
              rowDivs.push($el);
              currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
            }
            for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
                        rowDivs[currentDiv].height(currentTallest);
                    }
                });
        }
    },
    rating: function (element) {
        var ratingElement =
            '<span class="stars">' +
            '<i class="fa fa-star s1" data-score="1"></i>' +
            '<i class="fa fa-star s2" data-score="2"></i>' +
            '<i class="fa fa-star s3" data-score="3"></i>' +
            '<i class="fa fa-star s4" data-score="4"></i>' +
            '<i class="fa fa-star s5" data-score="5"></i>' +
            '<i class="fa fa-star s6" data-score="6"></i>' +
            '<i class="fa fa-star s7" data-score="7"></i>' +
            '<i class="fa fa-star s8" data-score="8"></i>' +
            '<i class="fa fa-star s9" data-score="9"></i>' +
            '<i class="fa fa-star s10" data-score="10"></i>' +
            '</span>';
        if (!element) {
            element = '';
        }
        $.each($(element + ' .star-rating'), function (i) {
            var _this = $(this);
            _this.append(ratingElement);
            if (_this.hasClass('active')) {
                var dataName = _this.attr('data-name');
                _this.append('<input readonly hidden="" name="score_' + dataName + '" id="score_' + dataName + '">');
            }
            // If rating exists
            var rating = _this.attr('data-rating');
            for (var e = 0; e < rating; e++) {
                var rate = e + 1;
                _this.children('.stars')
                    .children('.s' + rate)
                    .addClass('active');
            }
        });

        var ratingActive = $('.star-rating.active i');

        ratingActive.mouseenter(function () {
                var _this = $(this);
                var dataScore = _this.attr('data-score');
                for (var i = 0; i < dataScore; i++) {
                    var a = i + 1;
                    _this.parent()
                        .children('.s' + a)
                        .addClass('hover');
                }
            })
            .mouseleave(function () {
                var _this = $(this);
                var dataScore = _this.attr('data-score');
                for (var i = 0; i < dataScore; i++) {
                    var a = i + 1;
                    _this.parent()
                        .children('.s' + a)
                        .removeClass('hover');
                }
            });

        ratingActive.on('click', function () {
            var _this = $(this);
            _this.parents(".star-rating")
                .find("input")
                .val($(this)
                    .attr('data-score'));
            _this.parent()
                .children('.fa')
                .removeClass('active');
            for (var i = 0; i < _this.attr('data-score'); i++) {
                var a = i + 1;
                _this.parent()
                    .children('.s' + a)
                    .addClass('active');
            }
            return false;
        });
    },
    timeOutActions: function (_this) {
        setTimeout(function () {
            if (_this.find(".map")
                .length) {
                var modalDialog = _this.find(".modal-dialog");
                var dataAddress = modalDialog.data("address");
                var dataMarkerDrag = modalDialog.data("marker-drag");
                var dataLatitude = modalDialog.data("latitude");
                var dataLongitude = modalDialog.data("longitude");

                if (dataAddress) {
                    simpleMap(0, 0, "map-modal", dataMarkerDrag, dataAddress);
                } else {
                    simpleMap(dataLatitude, dataLongitude, "map-modal", dataMarkerDrag);
                }
            }
            this.initializeOwl();
            this.initializeFitVids();
            _this.addClass("show");
        }, 200);
    },
};

module.exports = Main;