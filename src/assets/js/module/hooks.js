var Hooks = function() {
  function getStorage() {
    return STORAGE;
  }
  function addAction(action, callback, priority, context) {
    if (typeof action === "string" && typeof callback === "function") {
      priority = parseInt(priority || 10, 10);
      _addHook("actions", action, callback, priority, context);
    }
    return MethodsAvailable;
  }
  function doAction() {
    var args = Array.prototype.slice.call(arguments);
    var action = args.shift();
    if (typeof action === "string") {
      _runHook("actions", action, args);
    }
    return MethodsAvailable;
  }
  function removeAction(action, callback) {
    if (typeof action === "string") {
      _removeHook("actions", action, callback);
    }
    return MethodsAvailable;
  }
  function addFilter(filter, callback, priority, context) {
    if (typeof filter === "string" && typeof callback === "function") {
      priority = parseInt(priority || 10, 10);
      _addHook("filters", filter, callback, priority, context);
    }
    return MethodsAvailable;
  }
  function applyFilters() {
    var args = Array.prototype.slice.call(arguments);
    var filter = args.shift();
    if (typeof filter === "string") {
      return _runHook("filters", filter, args);
    }
    return MethodsAvailable;
  }
  function removeFilter(filter, callback) {
    if (typeof filter === "string") {
      _removeHook("filters", filter, callback);
    }
    return MethodsAvailable;
  }
  function _removeHook(type, hook, callback, context) {
    if (!STORAGE[type][hook]) {
      return;
    }
    if (!callback) {
      STORAGE[type][hook] = [];
    } else {
      var handlers = STORAGE[type][hook];
      var i;
      if (!context) {
        i = handlers.length;
        for (;i--;) {
          if (handlers[i].callback === callback) {
            handlers.splice(i, 1);
          }
        }
      } else {
        i = handlers.length;
        for (;i--;) {
          var handler = handlers[i];
          if (handler.callback === callback && handler.context === context) {
            handlers.splice(i, 1);
          }
        }
      }
    }
  }
  function _addHook(type, hook, callback, priority, context) {
    var hookObject = {
      callback : callback,
      priority : priority,
      context : context
    };
    var hooks = STORAGE[type][hook];
    if (hooks) {
      hooks.push(hookObject);
      hooks = _hookInsertSort(hooks);
    } else {
      hooks = [hookObject];
    }
    STORAGE[type][hook] = hooks;
  }
  function _hookInsertSort(hooks) {
    var tmpHook;
    var j;
    var prevHook;
    var i = 1;
    var len = hooks.length;
    for (;i < len;i++) {
      tmpHook = hooks[i];
      j = i;
      for (;(prevHook = hooks[j - 1]) && prevHook.priority > tmpHook.priority;) {
        hooks[j] = hooks[j - 1];
        --j;
      }
      hooks[j] = tmpHook;
    }
    return hooks;
  }
  function _runHook(type, hook, args) {
    var handlers = STORAGE[type][hook];
    if (!handlers) {
      return type === "filters" ? args[0] : false;
    }
    var i = 0;
    var len = handlers.length;
    if (type === "filters") {
      for (;i < len;i++) {
        args[0] = handlers[i].callback.apply(handlers[i].context, args);
      }
    } else {
      for (;i < len;i++) {
        handlers[i].callback.apply(handlers[i].context, args);
      }
    }
    return type === "filters" ? args[0] : true;
  }
  var MethodsAvailable = {
    removeFilter : removeFilter,
    applyFilters : applyFilters,
    addFilter : addFilter,
    removeAction : removeAction,
    doAction : doAction,
    addAction : addAction,
    storage : getStorage
  };
  var STORAGE = {
    actions : {},
    filters : {}
  };
  return MethodsAvailable;
};

module.exports = new Hooks();