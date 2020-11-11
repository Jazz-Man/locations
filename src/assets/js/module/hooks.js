const EventEmitter = require('events').EventEmitter;

const Hooks = function () {

  this.e = new EventEmitter;
  // this.e.setMaxListeners(10);
  const _this = this;

  function addAction(action, callback) {
    if (typeof action === "string" && typeof callback === "function") {
      _this.e.on(action, callback);
    }
    return MethodsAvailable;
  }

  function doAction() {
    const args = Array.prototype.slice.call(arguments);
    const action = args.shift();
    if (typeof action === "string") {
      _this.e.emit(action, args);
    }
    return MethodsAvailable;
  }

  function removeAction(action, callback) {
    if (typeof action === "string") {
      _this.e.removeListener(action, callback);
    }
    return MethodsAvailable;
  }

  function removeAllAction() {
    _this.e.removeAllListeners();
    return MethodsAvailable;
  }

  var MethodsAvailable = {
    removeAction: removeAction,
    removeAllAction: removeAllAction,
    doAction: doAction,
    addAction: addAction
  };

  return MethodsAvailable;
};

module.exports = new Hooks();