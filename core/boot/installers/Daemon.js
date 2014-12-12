/**
 * Daemon installs a daemon.
 * @alias Daemon
 * @memberOf core/boot/installers
 * @param {EStore} store
 * @constructor
 *
 */
module.exports = function Daemon(store) {

	this.daemon = function(ext) {
		store.addEventListener(store.SERVER_STARTED, function() {

			setInterval(ext.exec.bind(ext)(store), ext.interval);

		});
	};
};

module.exports.prototype = require('./PrototypeInstaller');
