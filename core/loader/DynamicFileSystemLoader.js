/**
 * @module
 */
var nunjucks = require('nunjucks');

/**
 * DynamicFileSystemLoader wraps around the nunjucks FileSystemLoader
 * to allow the template directory to be changed.
 * @alias DynamicFileSystemLoader
 * @param {Theme} theme
 * @constructor
 *
 */
module.exports = function DynamicFileSystemLoader(theme) {


	/**
	 * getSource returns the template asked for.
	 *
	 * @param {String} tmpl
	 * @return {Object}
	 */
	this.getSource = function(tmpl) {

		return (new nunjucks.FileSystemLoader(theme.templates())).getSource(tmpl);

	};



};
