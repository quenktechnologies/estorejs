/** @module */

var path = require('path');

/**
 * Theme represents the theme to be used by the system.
 * @alias Theme
 * @param {String} base The path to the themes folder.
 * @constructor
 *
 */
module.exports = function Theme(base) {

	var Directory = require('./Directory');
	Directory.call(this, base);


	/**
	 * templates provides the path to the templates.
	 * @return {String}
	 *
	 */
	this.templates = function() {

		return base + '/templates';

	};

	/**
	 * statics provides the path to the static files.
	 * @return {String}
	 */
	this.statics = function() {

		return base + '/public';

	};

	/**
	 * emails provides the path to the email templates.
	 * @return {String}
	 *
	 */
	this.emails = function() {

		if (this.exists('email'))
			return base + '/email';

		return path.dirname(base) + '/default/templates/email';

	};


};
