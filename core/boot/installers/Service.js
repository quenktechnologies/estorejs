/**
 * Service installs a service.
 * @alias Service
 * @memberOf core/boot/installers
 * @param {EStore} store
 * @constructor
 *
 */
module.exports = function Service(store) {

	this.service = function(ext) {

		var f = function() {
			//@todo optimise arguments
			var args = Array.prototype.slice.call(arguments);
			args.push(store);
			ext.action.apply(ext, args);

		};

		if (ext.repeat)
			return store.bus.on(ext.event, f);

		store.addEventListener(ext.event, f);



	};

};
module.exports.prototype = require('./PrototypeInstaller');
