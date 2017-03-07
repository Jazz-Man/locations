var $$ = require('domtastic');
var transitionEnd = require('./transition-end');
var BaseClass = $$.BaseClass;

function SideNav(name) {
	BaseClass.apply(this, arguments);
}

SideNav.prototype = Object.create(BaseClass.prototype);

SideNav.prototype.constructor = SideNav;

SideNav.prototype.init = function (options) {
	var element = this;
	
	options = options || {};
	
	// event targets and constants
	var accordion = null,
		stringCollapse = 'Collapse',
		collapse = null, self = this,
		isAnimating = false, // when true it will prevent click handlers
		targetsReg = /^\#(.)+$/,
		accordionData = element.attr('data-parent'),
		
		collapsed = 'collapsed',
		
		// private methods
		openAction = function (collapseElement) {
			isAnimating = true;
			collapseElement = $$(collapseElement);
			collapseElement.addClass('collapsing show');
			setTimeout(function () {
				collapseElement.css({'height': getMaxHeight(collapseElement) + 'px'});
				
				(function () {
					transitionEnd(collapseElement,function () {
						isAnimating = false;
						collapseElement.attr('aria-expanded', 'true');
						collapseElement.removeClass('collapsing');
						collapseElement.css({'height' : ''});
					});
					}());
			}, 20);
		},
		closeAction = function (collapseElement) {
			isAnimating = true;
			setTimeout(function () {
				collapseElement.addClass('collapsing');
				collapseElement.css({'height':'0px'});
				
				(function () {
					transitionEnd(collapseElement, function () {
							isAnimating = false;
							collapseElement.attr('aria-expanded', 'false');
							collapseElement.removeClass('collapsing');
							collapseElement.removeClass('show');
							collapseElement[style][height] = '';
						});
					}());
			}, 20);
		},
		getTarget = function () {
			var href = element.href && element.attr('href'),
				parent = element.attr('data-target'),
				id = href || (parent && targetsReg.test(parent) ) && parent;
			return id && $$(id);
		};
	
	// public methods
	this.toggle = function (e) {
		e.preventDefault();
		if (isAnimating) {
			return;
		}
		if (!collapse.hasClass('show')) {
			self.show();
		}
		else {
			self.hide();
		}
	};
	this.hide = function () {
		closeAction(collapse);
		element.addClass(collapsed);
	};
	this.show = function () {
		openAction(collapse);
		element.removeClass(collapsed);
		
		if (accordion !== null) {
			var activeCollapses = getElementsByClassName(accordion, '.collapse.show');
			for (var i = 0, al = activeCollapses[length]; i < al; i++) {
				if (activeCollapses[i] !== collapse) {closeAction(activeCollapses[i]);}
			}
		}
	};
	
	// init
	if (!(stringCollapse in element )) { // prevent adding event handlers twice
		element.on('click', this.toggle);
	}
	collapse = getTarget();
	accordion = $$(options.parent) || accordionData && element.closest(element, accordionData);
	element[stringCollapse] = this;
};

var rabbit = new SideNav('[data-toggle=off-canvas]');
rabbit.init();
console.log(rabbit);