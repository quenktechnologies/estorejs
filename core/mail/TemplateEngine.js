/**
 * @module
 */
var nunjucks = require('nunjucks');

/**
 * TemplateCompiler compiles a template for email sending.
 * @alias TemplateCompiler
 * @param {String} path
 * @constructor
 *
 */
module.exports = function TemplateCompiler(path) {

	/**
	 * compile will do good things
	 *
	 * @param {String} html
	 * @returns {Function}
	 *
	 */
	this.compile = function(html) {

		return function(locals) {

			var env = nunjucks.configure(path, {
				autoescape: true
			});
			return env.renderString(html, locals);
		};
	};

};
