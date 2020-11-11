const $$ = require('domtastic');

module.exports = function (id, data) {

	const tpl = $$('#tmpl-' + id).html();
	const options = {
		variable: 'data',
		imports: {'$$': $$}
	};

	const template = require('lodash/template');
	const compiled = template(tpl, options);

	return compiled(data);
	
};