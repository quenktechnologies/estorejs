var ControllerPrototype = require('./ControllerPrototype');
/**
 * Controller installs controllers.
 * @todo break up to support multiple controller types.
 * @alias Controller
 * @memberOf core/boot/installers
 * @param {EStore} store
 * @param {Configuration} config
 * @constructor
 *
 */
module.exports = function Controller(store, dao, controllers, callbacks, config) {

	this.controller = function(ext) {
		ext.controller.prototype = ControllerPrototype;
		controllers.add(new ext.controller(store, dao, controllers, callbacks, config));
                console.log('DEBUG: Load controller extension:', ext.name);
	};


};
module.exports.prototype = require('./PrototypeInstaller');
