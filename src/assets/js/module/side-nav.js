var $$ = require('domtastic');
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
    var accordion = null, stringCollapse  = 'Collapse', collapse = null, self = this,
        isAnimating = false, // when true it will prevent click handlers
        accordionData = element.attr('data-parent'),

    // component strings
        component = 'collapse',
        collapsed = 'collapsed',

    // private methods
        openAction = function(collapseElement) {
            isAnimating = true;
            addClass(collapseElement,collapsing);
            addClass(collapseElement,showClass);
            setTimeout(function() {
                collapseElement[style][height] = getMaxHeight(collapseElement) + 'px';

                (function(){
                    emulateTransitionEnd(collapseElement, function(){
                        isAnimating = false;
                        collapseElement[setAttribute](ariaExpanded,'true');
                        removeClass(collapseElement,collapsing);
                        collapseElement[style][height] = '';
                        bootstrapCustomEvent.call(collapseElement, shownEvent, component);
                    });
                }());
            }, 20);
        },
        closeAction = function(collapseElement) {
            bootstrapCustomEvent.call(collapseElement, hideEvent, component);
            isAnimating = true;
            collapseElement[style][height] = getMaxHeight(collapseElement) + 'px';
            setTimeout(function() {
                addClass(collapseElement,collapsing);
                collapseElement[style][height] = '0px';

                (function() {
                    emulateTransitionEnd(collapseElement, function(){
                        isAnimating = false;
                        collapseElement[setAttribute](ariaExpanded,'false');
                        removeClass(collapseElement,collapsing);
                        removeClass(collapseElement,showClass);
                        collapseElement[style][height] = '';
                        bootstrapCustomEvent.call(collapseElement, hiddenEvent, component);
                    });
                }());
            },20);
        },
        getTarget = function() {
            var href = element.href && element.attr('href'),
                parent = element.attr(dataTarget),
                id = href || ( parent && targetsReg.test(parent) ) && parent;
            return id && queryElement(id);
        };

    // public methods
    this.toggle = function(e) {
        e.preventDefault();
        if (isAnimating) return;
        if (!hasClass(collapse,showClass)) { self.show(); }
        else { self.hide(); }
    };
    this.hide = function() {
        closeAction(collapse);
        addClass(element,collapsed);
    };
    this.show = function() {
        openAction(collapse);
        removeClass(element,collapsed);

        if ( accordion !== null ) {
            var activeCollapses = getElementsByClassName(accordion,component+' '+showClass);
            for (var i=0, al=activeCollapses[length]; i<al; i++) {
                if ( activeCollapses[i] !== collapse) closeAction(activeCollapses[i]);
            }
        }
    };

    // init
    if ( !(stringCollapse in element ) ) { // prevent adding event handlers twice
        element.on('click', this.toggle);
    }
    collapse = getTarget();
    accordion = $$(options.parent) || accordionData && element.closest(element, accordionData);
    element[stringCollapse] = this;
};


var rabbit = new SideNav('[data-toggle=off-canvas]');
rabbit.init();
console.log(rabbit);