/**
 * Theme represents the theme to be used by the system.
 * @class Theme
 * @param {String} base The path to the themes folder.
 * @param {String} theme The theme selected.
 * @constructor
 *
 */
module.exports = function Theme(base, theme) {

	var self = {};
	var _path = base + '/' + theme;

	/**
	 * has makes a check for a folder in the theme path.
	 *
	 * @method has
	 * @param {String} folder
	 * @return {Boolean}
	 *
	 */
	self.has = function(folder) {

		if ((folder === '') || (!folder))
			return false;

		var fs = require('fs');
		return fs.existsSync(_path + '/' + folder);

	};

	/**
	 * get returns the object exported from the specified path.
	 *
	 * @method get
	 * @param {String} folder
	 * @return {Object}
	 *
	 */
	self.get = function(folder) {

		var O = require(_path + '/' + folder);
		return new O();

	};

	/**
	 * exists checks if the current theme is actually available.
	 *
	 * @method exists
	 * @return
	 *
	 */
	self.exists = function() {

		var fs = require('fs');
		return fs.existsSync(_path);

	};


	/**
	 * getThemePath returns the path to the theme.
	 *
	 * @method getThemePath
	 * @return {String}
	 *
	 */
	self.getThemePath = function() {

		return _path;

	};

	/**
	 * getTemplatePath returns the path to the templates.
	 *
	 * @method getTemplatePath
	 * @return  {String}
	 *
	 */
	self.getTemplatePath = function() {

		return _path + '/private';

	};

	/**
	 * getStaticPath returns the path for static files.
	 *
	 * @method getStaticPath
	 * @return {String}
	 *
	 */
	self.getStaticPath = function() {

		return _path + '/public';


	};

	/**
	 * getEmailPath returns the path for emails.
	 *
	 * @method getEmailPath
	 * @return {String}
	 *
	 */
	self.getEmailPath = function() {

		return _path + '/emails';

	};

	/**
	 * get returns the required file specified.
	 *
	 * @method get
         * @param {String} file 
	 * @return {Object}
	 *
	 */
	self.get= function(file) {


		return require(_path + '/'+file);

	};

	/**
	 * use changes the theme in use.
	 *
	 * @method use
	 * @param {String} theme
	 * @return
	 *
	 */
	self.use = function(theme) {

		_path = base + '/' + theme;
		return self;

	};


	return self;


};
