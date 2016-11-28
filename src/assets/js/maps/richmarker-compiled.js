var e = {
  TOP_LEFT: 1,
  TOP: 2,
  TOP_RIGHT: 3,
  LEFT: 4,
  MIDDLE: 5,
  RIGHT: 6,
  BOTTOM_LEFT: 7,
  BOTTOM: 8,
  BOTTOM_RIGHT: 9
};
function RichMarker(obj) {
  var lowerCase = obj || {};
  this.d = this.c = udataCur;
  if (obj.visible == undefined) {
    obj.visible = value;
  }
  if (obj.shadow == undefined) {
    obj.shadow = "7px -3px 5px rgba(88,88,88,0.7)";
  }
  if (obj.anchor == undefined) {
    obj.anchor = e.BOTTOM;
  }
  this.setValues(lowerCase);
}

function parse(dataAndEvents, s) {
  var tempDiv = document.createElement("DIV");
  tempDiv.innerHTML = s;
  if (tempDiv.childNodes.length == 1) {
    return tempDiv.removeChild(tempDiv.firstChild);
  } else {
    var fragment = document.createDocumentFragment();
    for (; tempDiv.firstChild;) {
      fragment.appendChild(tempDiv.firstChild);
    }
    return fragment;
  }
}

function removeChildren(dataAndEvents, node) {
  if (node) {
    var child;
    for (; child = node.firstChild;) {
      node.removeChild(child);
    }
  }
}

function on(object, element) {
  if (object.c) {
    var val = "";
    if (navigator.userAgent.indexOf("Gecko/") !== -1) {
      if (element == "dragging") {
        val = "-moz-grabbing";
      }
      if (element == "dragready") {
        val = "-moz-grab";
      }
    } else {
      if (element == "dragging" || element == "dragready") {
        val = "move";
      }
    }
    if (element == "draggable") {
      val = "pointer";
    }
    if (object.a.style.cursor != val) {
      object.a.style.cursor = val;
    }
  }
}

function initialize(self, options) {
  if (self.getDraggable()) {
    if (!self.d) {
      self.d = value;
      var data_user = self.getMap();
      self.m = data_user.get("draggable");
      data_user.set("draggable", udataCur);
      self.h = options.clientX;
      self.i = options.clientY;
      on(self, "dragready");
      self.a.style.MozUserSelect = "none";
      self.a.style.KhtmlUserSelect = "none";
      self.a.style.WebkitUserSelect = "none";
      self.a.unselectable = "on";
      self.a.onselectstart = function () {
        return udataCur;
      };
      init(self);
      google.maps.event.trigger(self, "dragstart");
    }
  }
}

function start(e) {
  if (e.getDraggable()) {
    if (e.d) {
      e.d = udataCur;
      e.getMap()
       .set("draggable", e.m);
      e.h = e.i = e.m = null;
      e.a.style.MozUserSelect = "";
      e.a.style.KhtmlUserSelect = "";
      e.a.style.WebkitUserSelect = "";
      e.a.unselectable = "off";
      e.a.onselectstart = function () {};
      reset(e);
      on(e, "draggable");
      google.maps.event.trigger(e, "dragend");
      e.draw();
    }
  }
}

function handler(self, event) {
  if (!self.getDraggable() || !self.d) {
    start(self);
  } else {
    var x = self.h - event.clientX;
    var y = self.i - event.clientY;
    self.h = event.clientX;
    self.i = event.clientY;
    x = parseInt(self.a.style.left, 10) - x;
    y = parseInt(self.a.style.top, 10) - y;
    self.a.style.left = x + "px";
    self.a.style.top = y + "px";
    var bounds = redraw(self);
    self.setPosition(self.getProjection()
                         .fromDivPixelToLatLng(new google.maps.Point(x - bounds.width, y - bounds.height)));
    on(self, "dragging");
    google.maps.event.trigger(self, "drag");
  }
}

function success(object) {
  if (object.f) {
    google.maps.event.removeListener(object.f);
    delete object.f;
  }
  on(object, "");
}

function main(object, options) {
  if (options) {
    object.f = google.maps.event.addDomListener(options, "mousedown", function (pending) {
      initialize(object, pending);
    });
    on(object, "draggable");
  }
}

function init(e) {
  if (e.a.setCapture) {
    e.a.setCapture(value);
    e.e = [google.maps.event.addDomListener(e.a, "mousemove", function (event) {
      handler(e, event);
    }, value), google.maps.event.addDomListener(e.a, "mouseup", function () {
      start(e);
      e.a.releaseCapture();
    }, value)];
  } else {
    e.e = [google.maps.event.addDomListener(window, "mousemove", function (event) {
      handler(e, event);
    }, value), google.maps.event.addDomListener(window, "mouseup", function () {
      start(e);
    }, value)];
  }
}

function reset(evt) {
  if (evt.e) {
    var i = 0;
    var cb;
    for (; cb = evt.e[i]; i++) {
      google.maps.event.removeListener(cb);
    }
    evt.e.length = 0;
  }
}

function redraw(s) {
  // debugger;
  var result = s.l();
  if (typeof result == "object") {
    return result;
  }
  var map = new google.maps.Size(0, 0);
  if (!s.b) {
    return map;
  }
  var x = s.b.offsetWidth;
  s = s.b.offsetHeight;
  switch (result) {
    case e.TOP:
      map.width = -x / 2;
      break;
    case e.TOP_RIGHT:
      map.width = -x;
      break;
    case e.LEFT:
      map.height = -s / 2;
      break;
    case e.MIDDLE:
      map.width = -x / 2;
      map.height = -s / 2;
      break;
    case e.RIGHT:
      map.width = -x;
      map.height = -s / 2;
      break;
    case e.BOTTOM_LEFT:
      map.height = -s;
      break;
    case e.BOTTOM:
      map.width = -x / 2;
      map.height = -s;
      break;
    case e.BOTTOM_RIGHT:
      map.width = -x;
      map.height = -s;
  }
  return map;
}
var value = true;
var udataCur = false;
RichMarker.prototype = new google.maps.OverlayView;
RichMarker.prototype.getVisible = function () {
  return this.get("visible");
};
RichMarker.prototype.getVisible = RichMarker.prototype.getVisible;
RichMarker.prototype.setVisible = function (visible) {
  this.set("visible", visible);
};
RichMarker.prototype.setVisible = RichMarker.prototype.setVisible;
RichMarker.prototype.s = function () {
  if (this.c) {
    this.a.style.display = this.getVisible() ? "" : "none";
    this.draw();
  }
};
RichMarker.prototype.visible_changed = RichMarker.prototype.s;
RichMarker.prototype.setFlat = function (dataAndEvents) {
  this.set("flat", !!dataAndEvents);
};
RichMarker.prototype.setFlat = RichMarker.prototype.setFlat;
RichMarker.prototype.getFlat = function () {
  return this.get("flat");
};
RichMarker.prototype.getFlat = RichMarker.prototype.getFlat;
RichMarker.prototype.p = function () {
  return this.get("width");
};
RichMarker.prototype.getWidth = RichMarker.prototype.p;
RichMarker.prototype.o = function () {
  return this.get("height");
};
RichMarker.prototype.getHeight = RichMarker.prototype.o;
RichMarker.prototype.setShadow = function (options) {
  this.set("shadow", options);
  this.g();
};
RichMarker.prototype.setShadow = RichMarker.prototype.setShadow;
RichMarker.prototype.getShadow = function () {
  return this.get("shadow");
};
RichMarker.prototype.getShadow = RichMarker.prototype.getShadow;
RichMarker.prototype.g = function () {
  if (this.c) {
    this.a.style.boxShadow = this.a.style.webkitBoxShadow = this.a.style.MozBoxShadow = this.getFlat() ? "" : this.getShadow();
  }
};
RichMarker.prototype.flat_changed = RichMarker.prototype.g;
RichMarker.prototype.setZIndex = function (idx) {
  this.set("zIndex", idx);
};
RichMarker.prototype.setZIndex = RichMarker.prototype.setZIndex;
RichMarker.prototype.getZIndex = function () {
  return this.get("zIndex");
};
RichMarker.prototype.getZIndex = RichMarker.prototype.getZIndex;
RichMarker.prototype.t = function () {
  if (this.getZIndex() && this.c) {
    this.a.style.zIndex = this.getZIndex();
  }
};
RichMarker.prototype.zIndex_changed = RichMarker.prototype.t;
RichMarker.prototype.getDraggable = function () {
  return this.get("draggable");
};
RichMarker.prototype.getDraggable = RichMarker.prototype.getDraggable;
RichMarker.prototype.setDraggable = function (autoShow) {
  this.set("draggable", !!autoShow);
};
RichMarker.prototype.setDraggable = RichMarker.prototype.setDraggable;
RichMarker.prototype.k = function () {
  if (this.c) {
    if (this.getDraggable()) {
      main(this, this.a);
    } else {
      success(this);
    }
  }
};
RichMarker.prototype.draggable_changed = RichMarker.prototype.k;
RichMarker.prototype.getPosition = function () {
  return this.get("position");
};
RichMarker.prototype.getPosition = RichMarker.prototype.getPosition;
RichMarker.prototype.setPosition = function (y) {
  this.set("position", y);
};
RichMarker.prototype.setPosition = RichMarker.prototype.setPosition;
RichMarker.prototype.q = function () {
  this.draw();
};
RichMarker.prototype.position_changed = RichMarker.prototype.q;
RichMarker.prototype.l = function () {
  return this.get("anchor");
};
RichMarker.prototype.getAnchor = RichMarker.prototype.l;
RichMarker.prototype.r = function (context) {
  this.set("anchor", context);
};
RichMarker.prototype.setAnchor = RichMarker.prototype.r;
RichMarker.prototype.n = function () {
  this.draw();
};
RichMarker.prototype.anchor_changed = RichMarker.prototype.n;
RichMarker.prototype.setContent = function (content) {
  this.set("content", content);
};
RichMarker.prototype.setContent = RichMarker.prototype.setContent;
RichMarker.prototype.getContent = function () {
  return this.get("content");
};
RichMarker.prototype.getContent = RichMarker.prototype.getContent;
RichMarker.prototype.j = function () {
  if (this.b) {
    removeChildren(this, this.b);
    var source = this.getContent();
    if (source) {
      if (typeof source == "string") {
        source = source.replace(/^\s*([\S\s]*)\b\s*$/, "$1");
        source = parse(this, source);
      }
      this.b.appendChild(source);
      var text = this;
      source = this.b.getElementsByTagName("IMG");
      var idx = 0;
      var member;
      for (; member = source[idx]; idx++) {
        google.maps.event.addDomListener(member, "mousedown", function (ev) {
          if (text.getDraggable()) {
            if (ev.preventDefault) {
              ev.preventDefault();
            }
            ev.returnValue = udataCur;
          }
        });
        google.maps.event.addDomListener(member, "load", function () {
          text.draw();
        });
      }
      google.maps.event.trigger(this, "domready");
    }
    if (this.c) {
      this.draw();
    }
  }
};
RichMarker.prototype.content_changed = RichMarker.prototype.j;
RichMarker.prototype.onAdd = function () {
  if (!this.a) {
    this.a = document.createElement("DIV");
    this.a.style.position = "absolute";
  }
  if (this.getZIndex()) {
    this.a.style.zIndex = this.getZIndex();
  }
  this.a.style.display = this.getVisible() ? "" : "none";
  if (!this.b) {
    this.b = document.createElement("DIV");
    this.a.appendChild(this.b);
    var details = this;
    google.maps.event.addDomListener(this.b, "click", function () {
      google.maps.event.trigger(details, "click");
    });
    google.maps.event.addDomListener(this.b, "mouseover", function () {
      google.maps.event.trigger(details, "mouseover");
    });
    google.maps.event.addDomListener(this.b, "mouseout", function () {
      google.maps.event.trigger(details, "mouseout");
    });
  }
  this.c = value;
  this.j();
  this.g();
  this.k();
  var panes = this.getPanes();
  if (panes) {
    panes.overlayImage.appendChild(this.a);
  }
  google.maps.event.trigger(this, "ready");
};
RichMarker.prototype.onAdd = RichMarker.prototype.onAdd;
RichMarker.prototype.draw = function () {
  if (!(!this.c || this.d)) {
    var b = this.getProjection();
    if (b) {
      var c = this.get("position");
      b = b.fromLatLngToDivPixel(c);
      c = redraw(this);
      this.a.style.top = b.y + c.height + "px";
      this.a.style.left = b.x + c.width + "px";
      b = this.b.offsetHeight;
      c = this.b.offsetWidth;
      if (c != this.get("width")) {
        this.set("width", c);
      }
      if (b != this.get("height")) {
        this.set("height", b);
      }
    }
  }
};
RichMarker.prototype.draw = RichMarker.prototype.draw;
RichMarker.prototype.onRemove = function () {
  if (this.a) {
    if (this.a.parentNode) {
      this.a.parentNode.removeChild(this.a);
    }
  }
  success(this);
};
RichMarker.prototype.onRemove = RichMarker.prototype.onRemove;
// self.prototype.RichMarkerPosition = e;

// window.RichMarkerPosition = e;
module.exports = RichMarker;