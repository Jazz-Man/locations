const $$ = require("domtastic");
const Hooks = require("./hooks");
const win = $$(window);

const ViewPort = {
  queries: [],
  current: "",
  atLeast: function (size) {
    const query = this.get(size);
    if (query) {
      return window.matchMedia(query).matches;
    }
    return false;
  },
  is: function (size) {
    size = size.trim().split(" ");
    if (size.length > 1 && size[1] === "only") {
      if (size[0] === this.getCurrentSize()) {
        return true;
      }
    } else {
      return this.atLeast(size[0]);
    }
    return false;
  },
  get: function (size) {
    const _this = this;
    $$(_this.queries).forEach(function (queries, i) {
      if (_this.queries.hasOwnProperty(i)) {
        const query = _this.queries[i];
        if (size === query.name) {
          return query.value;
        }
      }
    });
    return null;
  },
  getCurrentSize: function () {
    const _this = this;
    let matched;
    $$(_this.queries).forEach(function (queries, i) {
      const query = _this.queries[i];
      if (window.matchMedia(query.value).matches) {
        matched = query;
      }
    });

    return typeof matched === "object" ? matched.name : matched;
  },
  watcher: function () {
    const _this = this;
    win.on("resize.mq.mediaquery", function () {
      const newSize = _this.getCurrentSize();
      const currentSize = _this.current;
      if (newSize !== currentSize) {
        _this.current = newSize;
        win.trigger("change_mediaquery", {
          new_size: newSize,
          current_size: currentSize
        });
      }
    });
  }
};
if (!window.matchMedia) {
  window.matchMedia = function() {
    let styleMedia = window.styleMedia || window.media;
    if (!styleMedia) {
      const style = document.createElement("style");
      const script = document.getElementsByTagName("script")[0];
      let info = null;
      style.type = "text/css";
      style.id = "matchmediajs-test";
      if (script) {
        if (script.parentNode) {
          script.parentNode.insertBefore(style, script);
        }
      }
      info = "getComputedStyle" in window && window.getComputedStyle(style, null) || style.currentStyle;
      styleMedia = {
        matchMedium : function(media) {
          const text = "@media " + media + "{ #matchmediajs-test { width: 1px; } }";
          if (style.styleSheet) {
            style.styleSheet.cssText = text;
          } else {
            style.textContent = text;
          }
          return info.width === "1px";
        }
      };
    }
    return function(media) {
      return{
        matches : styleMedia.matchMedium(media || "all"),
        media : media || "all"
      };
    };
  }();
}

function view_port_init() {
  const self = ViewPort;
  const namedQueries = {
    xs: "0",
    sm: "576px",
    md: "768px",
    lg: "992px",
    xl: "1200px"
  };
  let key;

  for (key in namedQueries) {
    if (namedQueries.hasOwnProperty(key)) {
      self.queries.push({
        name : key,
        value : "only screen and (min-width: " + namedQueries[key] + ")"
      });
    }
  }
  self.current = self.getCurrentSize();
  self.watcher();
}

Hooks.addAction("_init", view_port_init);

module.exports = ViewPort;