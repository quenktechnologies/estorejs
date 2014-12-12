/**
 * Gateway installs gateways
 * @alias Gateway
 * @memberOf core/boot/installers
 * @param {Object} gateways
 * @constructor
 *
 */
module.exports = function Gateway(gateways) {


	this.gateway = function(ext) {

		gateways.available.push(ext);

	};

};
module.exports.prototype = require('./PrototypeInstaller');
