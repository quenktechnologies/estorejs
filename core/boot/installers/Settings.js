/**
 * Settings installs settings
 * @alias Settings
 * @memberOf core/boot/installers
 * @param {Installer} installer
 * @constructor
 *
 */
module.exports = function Settings(installer) {

	this.settings = function(settings) {
		settings.type = 'model';
		settings.name = 'Settings';
		installer.install(settings);

	};


};
module.exports.prototype = require('./PrototypeInstaller');
