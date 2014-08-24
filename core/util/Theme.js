/**
 * Theme represents the theme to be used by the system.
 * @class Theme
 * @param {String} base The path to the themes folder.
 * @param {String} theme The theme selected.
 * @constructor
 *
 */
module.exports = function Theme(base, theme) {

	var Directory = require('./Directory');
	Directory.call(this, base + '/' + theme);

	/**
	 * getThemePath returns the path to the theme.
	 *
	 * @method getThemePath
	 * @return {String}
	 *
	 */
	self.getThemePath = function() {

		return this._path;

	};

	/**
	 * getTemplatePath returns the path to the templates.
	 *
	 * @method getTemplatePath
	 * @return  {String}
	 *
	 */
	self.getTemplatePath = function() {

		return this._path + '/templates';

	};

	/**
	 * getStaticPath returns the path for static files.
	 *
	 * @method getStaticPath
	 * @return {String}
	 *
	 */
	self.getStaticPath = function() {

		return this._path + '/public';


	};

	/**
	 * getEmailPath returns the path for emails.
	 *
	 * @method getEmailPath
	 * @return {String}
	 *
	 */
	self.getEmailPath = function() {

		return this._path + '/emails';

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

		this._path = base + '/' + theme;
		return self;

	};


	return self;


};
