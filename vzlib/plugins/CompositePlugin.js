/**
 * CompositePlugin represents a composition of plugins.
 * @class CompositePlugin
 *
 * @constructor
 *
 */
module.exports = function CompositePlugin() {

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
	self.addDir = function(dir) {

		var args = Array.prototype.slice.call(arguments);
		args.shift();

		if (fs.statSync(dir).isDirectory()) {

			_(fs.readdirSync(dir)).each(function(file) {

				var ext = require('path').extname(file);

				if (ext != ".js")
					if (!fs.statSync(dir + '/' + file).isDirectory()) {
						system.log.info('Ignoring ' + dir + '/' + file);
						return;
					}

				system.log.info('Loading: ' + dir + '/' + file);
				var o = require(dir + '/' + file);
				self.add(o.apply(this, args));



			});

		}


	};


	/**
	 * onNunjucksReady is called after nunjucks has been configured.
	 *
	 * @method onNunjucksReady
	 * @param {Object} nunjucks
	 * @return
	 *
	 */
	self.onNunjucksReady = function(nunjucks) {
		_(plugins).each(function(plugin) {
			if (plugin.onNunjucksReady) {
				system.log.info('Configuring nunjucks for ' + plugin);
				plugin.onNunjucksReady(nunjucks);
			}

		});

	};

	/**
	 * onRoutingReady is called when routing needs to be setup.
	 *
	 * @method onRoutingReady
	 * @param {Object} app
	 * @return
	 *
	 */
	self.onRoutingReady = function(app) {

		_(plugins).each(function(plugin) {

			if (plugin.onRoutingReady)
				plugin.onRoutingReady(app);

		});



	};

	/**
	 * onKeyStoneReady is called to allow configuring of models.
	 *
	 * @method onKeyStoneReady
	 * @param {Object} keystone
	 * @return
	 *
	 */
	self.onKeyStoneReady = function(keystone) {

		_(plugins).each(function(plugin) {

			if (plugin.onKeyStoneReady)
				plugin.onKeyStoneReady(keystone);

		});



	};



	return self;


};
