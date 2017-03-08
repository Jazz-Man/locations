var $$ = require("domtastic");

//function transitionEnd(element, handler) {
//	var o = {
//		doc:        document.documentElement,
//		Transition: "Transition",
//		Webkit:     "Webkit"
//	};
//	var supportTransitions = o.Webkit + o.Transition in o.doc.style || o.Transition.toLowerCase() in o.doc.style;
//	var transitionEndEvent = o.Webkit + o.Transition in o.doc.style ? o.Webkit.toLowerCase() + o.Transition + "End" : o.Transition.toLowerCase() + "end";
//	if (supportTransitions) {
//		$$(element).one(transitionEndEvent, function (e) {
//			handler.apply(e);
//		});
//	}
//	else {
//		handler.apply();
//	}
//}

function getOuterHeight(child) {
	var childStyle = child && window.getComputedStyle(child);
	var btp = /px/.test(childStyle.borderTopWidth) ? Math.round(childStyle.borderTopWidth.replace("px", "")) : 0;
	var btb = /px/.test(childStyle.borderBottomWidth) ? Math.round(childStyle.borderBottomWidth.replace("px", "")) : 0;
	var mtp = /px/.test(childStyle.marginTop) ? Math.round(childStyle.marginTop.replace("px", "")) : 0;
	var mbp = /px/.test(childStyle.marginBottom) ? Math.round(childStyle.marginBottom.replace("px", "")) : 0;
	return child["clientHeight"] + parseInt(btp) + parseInt(btb) + parseInt(mtp) + parseInt(mbp);
}

function getMaxHeight(parent) {
	var _this = this;
	var parentHeight = 0;
	var children = parent.children();
	if (children.length) {
		children.forEach(function (i) {
			parentHeight += _this.getOuterHeight(i);
		});
	}
	return parentHeight;
}

var setAnimationDuration = function (el, duration) {
	var durationMs = duration ? duration + "ms" : "";
	el = $$(el);
	el.css({
		"-webkit-animation-duration":durationMs,
		"animation-duration":durationMs
	});
	
};

var setAnimateCssClasses = function (el, animationName, doAdd) {
	
	["animated", animationName].forEach(function (str) {
		$$(el).toggleClass(str,doAdd);
	});
};

var whichAnimationEvent = function () {
	var el = document.createElement("fakeelement");
	var t;
	var animations = {
		"animation":       "animationend",
		"OAnimation":      "oAnimationEnd",
		"MozAnimation":    "animationend",
		"WebkitAnimation": "webkitAnimationEnd"
	};
	for (t in animations) {
		if (el.style[t] !== undefined) {
			return animations[t];
		}
	}
};

var animate = function (el, opts) {
	el = $$(el);
	function animEnd() {
		el.off(animationEventName, animEnd);
		setAnimateCssClasses(el, opts.animationName, false);
		if (opts.duration) {
			setAnimationDuration(el);
		}
		opts.callbacks.forEach(function (cb) {
			cb();
		});
		opts.callbacks = [];
	}
	
	opts.callbacks = opts.callbacks || [];
	var animationEventName = whichAnimationEvent();
	if (opts.duration) {
		setAnimationDuration(el, opts.duration);
	}
	setAnimateCssClasses(el, opts.animationName);
	el.on(animationEventName, animEnd);
};

var show = function (el, opts) {
	el = $$(el);
	opts = opts || {};
	opts.animationName = opts.animationName || "slideInDown";
	opts.duration = opts.duration || 350;
	el.removeClass("hide").addClass("show");
	animate(el, opts);
};

var hide = function (el, opts) {
	el = $$(el);
	opts = opts || {};
	opts.animationName = opts.animationName || "slideOutUp";
	opts.duration = opts.duration || 300;
	opts.callbacks = opts.callbacks || [];
	
	opts.callbacks.push(function () {
		el.removeClass("show").addClass("hide");
	});
	
	animate(el, opts);
};

var util = {
	getOuterHeight: getOuterHeight,
	getMaxHeight:   getMaxHeight,
//	transitionEnd:  transitionEnd,
	animate:        animate,
	show:           show,
	hide:           hide
};
module.exports = util;
