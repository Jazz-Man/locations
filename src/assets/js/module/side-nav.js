var BaseClass = require('domtastic').BaseClass;

function SideNav(name) {
	BaseClass.apply(this, arguments);
}

// Унаследовать
SideNav.prototype = Object.create(BaseClass.prototype);

// Желательно и constructor сохранить
SideNav.prototype.constructor = SideNav;

SideNav.prototype.progress = function (value) {
	return this.attr('data-progress', value);
};


//// Готово, можно создавать объекты
var rabbit = new SideNav('[data-toggle=off-canvas]');
//rabbit.progress('ive').append('<p class="enhancement">enhancement</p>');
console.log(rabbit);