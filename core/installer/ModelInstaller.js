/**
 * @module
 */

/**
 * ModelInstaller is the installer for models.
 * @alias ModelInstaller
 * @implements Installer
 * @extends AbstractInstaller
 * @param {ModelRegistry} registry
 * @constructor
 *
 */
module.exports = function ModelInstaller(registry) {

	this.install = function(ext) {

		if ('model' !== ext.type)
			return this.next.install(ext);

		registry.add(ext);

	};


};

ModelInstaller.prototype = require('./AbstractInstaller');
