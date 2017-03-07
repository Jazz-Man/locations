var $$ = require('domtastic');

var o = {
    doc: document.documentElement,
    Transition: 'Transition',
    Webkit: 'Webkit'
};
var supportTransitions = o.Webkit + o.Transition in o.doc['style'] || o.Transition.toLowerCase() in o.doc['style'];
var transitionEndEvent = o.Webkit + o.Transition in o.doc['style'] ? o.Webkit.toLowerCase() + o.Transition + 'End' : o.Transition.toLowerCase() + 'end';

var transitionEnd = function (element, handler) {

    if (supportTransitions) {
        $$(element).one(transitionEndEvent, function (e) {
            handler.apply(e);
        });
    }
    else {
        handler.apply();
    }

};

module.exports = transitionEnd;