/**
 * Settings installs settings
 * @alias Settings
 * @memberOf core/boot/installers
 * @param {EStore} settings
 * @constructor
 *
 */
module.exports = function Settings(store) {

	this.settings = function(settings) {

		//TODO: remove in favor of just calling the run function.
		//Needs to wait until settings code is reviewed/refactored.
		if (settings.provide)
			store.settingFields[settings.key] = settings.provide(store, store.keystone.Field.Types);

		if (settings.run)
			store.runnableSettings.push(settings.run);


	};


};
module.exports.prototype = require('./PrototypeInstaller');
