/** @module */

var path = require('path');
var Directory = require('./Directory');

/**
 * ThemeProperties represents the theme to be used by the system.
 * @alias Theme
 * @param {String} base The path to the themes folder.
 * @constructor
 *
 */
module.exports = function ThemeProperties(base) {


	var props = require(base + '/package.json').estore;
	var dir = new Directory(base);

	/**
	 * getProperty
	 *
	 * @param {String} name
         * @return {*}
	 *
	 */
	this.getProperty = function(name) {

		return props[name];

	};

        /**
         * getProperties returns all the properties of the package file.
         * @return {Object} 
         *
         */
        this.getProperties = function () {

 return props;

        };



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

		if (dir.exists('email'))
			return base + '/email';

		return path.dirname(base) + '/default/templates/email';

	};


};
