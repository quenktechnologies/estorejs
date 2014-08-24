/**
 * Directory represents a directory we are interested in examining.
 * @class Directory
 * @constructor
 *
 */
module.exports = function Directory(path) {

	this._path = path;
	var fs = require('fs');

	/**
	 * has makes a check for a folder in the theme path.
	 *
	 * @method has
	 * @param {String} folder
	 * @return {Boolean}
	 *
	 */
	this.has = function(folder) {

		if ((folder === '') || (!folder))
			return false;

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
	this.get = function(folder) {

		return require(this._path + '/' + folder);

	};

	/**
	 * exists checks if the current theme is actually available.
	 *
	 * @method exists
	 * @return
	 *
	 */
	this.exists = function() {

		return fs.existsSync(_path);

	};



};
