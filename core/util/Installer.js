/**
 * @module
 */

var Controller = require('./Controller');

/**
 * Installer installs the extensions the system will use.
 *
 * Each method here (except install) corresponds to a type of extension
 * EStore supports.
 *
 * @todo
 * 1. Remove constructor args?
 * 2. Let caller retrieve desired extensions?
 *
 * @constructor
 * @param {EStore} store
 * @alias Installer
 *
 */
module.exports = function Installer(store) {

	var __Controller__ = new Controller();
	var self = this;

	/**
	 * Controller
	 *
	 * @method Controller
	 * @return
	 *
	 */
	this.controller = function(ext) {
		ext.controller.prototype = __Controller__;
		store.composite.add(new ext.controller(store));
	};

	/**
	 * Model
	 *
	 * @method Model
	 * @instance
	 * @return
	 *
	 */
	this.model = function(ext) {

		store.models.push(ext);


	};


	/**
	 * Composite
	 *
	 * @method Composite
	 * @return
	 *
	 */
	this.composite = function(compo) {

		compo.members.forEach(function(ext) {

			self.install(ext);

		});

	};

	/**
	 * Settings
	 *
	 * @method Settings
	 * @return
	 *
	 */
	this.settings = function(settings) {

		//TODO: remove in favor of just calling the run function.
		//Needs to wait until settings code is reviewed/refactored.
		if (settings.provide)
			store.settingFields[settings.key] = settings.provide(store, store.keystone.Field.Types);

		if (settings.run)
			store.runnableSettings.push(settings.run);
	};


	/**
	 * Gateway
	 *
	 * @method Gateway
	 * @return
	 *
	 */
	this.gateway = function(ext) {

		store.gateways.available.push(ext);
	};

	/**
	 * daemon installs a daemon extension.
	 *
	 * @method daemon
	 * @return
	 *
	 */
	this.daemon = function(ext) {

		store.daemons.push(ext);

	};

	/**
	 * service installs a service.
	 *
	 * Services are basically functions that listen for a specific event on the bus.
	 *
	 * example:
	 *
	 * ``module.exports = {
	 *
	 *    type: 'service',
	 *    repeat: false,
	 *    event: 'MY_EVENT',
	 *    action: function() {
	 *    }
	 *
	 *   };``
	 *
	 * TODO:
	 * 1. Support async?
	 * @method service
	 * @param {Object} ext
	 * @return
	 *
	 */
	this.service = function(ext) {

		var f = function() {
			var args = Array.prototype.slice.call(arguments);
			args.push(store);
			ext.action.apply(ext, args);

		};

		if (ext.repeat)
			return store.bus.on(ext.event, f);

		store.bus.once(ext.event, f);


	};

	/**
	 * engine
	 *
	 * @method engine
	 * @param {Object} ext
	 * @return
	 *
	 */
	this.engine = function(ext) {

		store.engines[ext.id] = ext.engine;

	};



	/**
	 * install an extension.
	 *
	 * @method install
	 * @param {Object} ext
	 * @return
	 *
	 */
	this.install = function(ext) {

		var f = self[ext.type];

		if (this.hasOwnProperty(ext.type)) {

			if (ext.type !== 'install')
				this[ext.type](ext);

			if (ext.settings)
				self.settings(ext.settings);

			//Debug
			console.log('extension: ' + ext.name);

		}




	};


};
