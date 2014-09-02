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

		return fs.existsSync(this._path + '/' + folder);

	};

	/**
	 * get returns the object exported from the specified path.
	 *
	 * @method get
	 * @param {String} folder
	 * @param {Boolean} recursive
	 * @return {Object|Array}
	 *
	 */
	this.get = function(folder, recursive) {

		if (!recursive)
			return require(this._path + '/' + folder);

		var list = fs.readdirSync(this._path + '/' + folder);
		var files = [];
		list.forEach(function(file) {

			if (file == '.gitkeep')
				return;

			files.push(require(this._path + '/' + folder + '/' + file));

		}.bind(this));

		return files;

	};

	/**
	 * exists checks if the current theme is actually available.
	 *
	 * @method exists
	 * @return
	 *
	 */
	this.exists = function() {

		return fs.existsSync(this._path);

	};



};
