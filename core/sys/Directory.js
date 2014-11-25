/**
 * @module
 */
var fs = require('fs');


/**
 * Directory provides methods for interacting with the file system.
 *
 * A single Directory instances represents a single path. All parameters
 * passed to methods are assumed to be realtive to this directory.
 *
 * @alias Directory
 * @param {String} path
 * @constructor
 *
 */
module.exports = function Directory(path) {

	var expand = function(p) {
		return path + '/' + p;

	};

	/**
	 *
	 * @property {Array} ignored A list of ignored files.
	 *
	 */
	this.ignored = ['.gitkeep'];

        /**
         * path returns the path of this directory.
         *
         * @return {Strnig}
         */
        this.path = function () {

          return path;

        };



	/**
	 * info returns `stat(2)` info about the directory.`
	 *
	 * @param {String} name
	 * @return {fs.stat}
	 *
	 */
	this.info = function(name) {

		if (!name)
			return fs.statSync(path);

		return fs.statSync(expand(name));

	};


	/**
	 * exists checks if this file/directory exists (sync).
	 *
	 * @param {String} name
	 * @return {Boolean}
	 *
	 */
	this.exists = function(name) {

		if (!name)
			return fs.existsSync(path);

		return fs.existsSync(expand(name));


	};

	/**
	 * forEachDirectory iterates over the directories only in the folder.
	 *
	 * @param {Function} cb
	 *
	 */
	this.forEachDirectory = function(cb) {

		var list = fs.readdirSync(path);
		var self = this;

		list.forEach(function(dir) {

			if (self.ignored.indexOf(dir) > -1)
				return;

			if (self.info(dir).isDirectory())
				cb(path + '/' + dir, dir, path);

		});

	};



	/**
	 * require calls the node require function.
	 *
	 * @param {String} name
	 *
	 */
	this.require = function(name) {

		return require(path + '/' + name);

	};






};
