/**
 * Composite installs a composite extensions.
 * @alias Composite
 * @memberOf core/boot/installers
 * @param {Installer} installer
 * @constructor
 *
 */
module.exports = function Composite(installer) {

	this.composite = function(ext) {

		ext.members.forEach(function(ext) {

			installer.install(ext);

		});


	};

};

module.exports.prototype = require('./PrototypeInstaller');
