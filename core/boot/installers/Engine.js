/**
 * Engine installs engines.
 * @alias Engine
 * @memberOf core/boot/installers
 * @param {EStore} engines
 * @constructor
 *
 */
module.exports = function Engine(engines) {

	this.engine = function(ext) {

		engines[ext.id] = ext.engine;

	};

};
module.exports.prototype = require('./PrototypeInstaller');
