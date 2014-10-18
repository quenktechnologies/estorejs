var Controller = require('./Controller');

/**
 * Installer installs the extensions into the main object.
 * @class Installer
 * @param {EStore} store
 * @constructor
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
	 * @return
	 *
	 */
	this.model = function(ext) {

		store.models[ext.name] = ext;


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
	 * install an extension.
	 *
	 * @method install
	 * @param {Object} ext An object declaring an extension.
	 * @return
	 *
	 */
	this.install = function(ext) {

		var f = self[ext.type];

		if (f)
			f(ext);

		if (ext.settings)
			self.settings(ext.settings);


	};


};
