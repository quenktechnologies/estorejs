/**
 * PluginScanner represents a composition of plugins.
 * @class PluginScanner
 *
 * @constructor
 *
 */
module.exports = function PluginScanner() {

	var self = {};
	var plugins = [];
	var _ = require('lodash');
	var fs = require('fs');


	/**
	 * add a plugin to this composite.
	 *
	 * @method add
	 * @param {Object} plugin
	 * @return
	 *
	 */
	self.add = function(plugin) {

		plugins.push(plugin);
		return self;



	};

	/**
	 * addDir adds an entire directory to the composite.
	 *
	 * @method addDir
	 * @param {String} dir The directory path.
	 * @return
	 *
	 */
	self.scan = function(dir) {

		if (fs.statSync(dir).isDirectory()) {

			fs.readdirSync(dir).forEach(function(file) {

				var ext = require('path').extname(file);

				if (ext != ".js")
					if (!fs.statSync(dir + '/' + file).isDirectory()) {
						system.log.info('Ignoring ' + dir + '/' + file);
						return;
					}

				system.log.info('Plugin found: ' + dir + '/' + file);
				var o = require(dir + '/' + file);
				self.add(o);



			});

		}

		return self;


	};


	/**
	 * getPlugins returns the plugins.
	 *
	 * @method getPlugins
	 * @return {Array}
	 *
	 */
	self.getPlugins = function() {

		return plugins;


	};

	return self;


};
