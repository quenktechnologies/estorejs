/**
 * Controller installs controllers.
 * @todo break up to support multiple controller types.
 * @alias Controller
 * @memberOf core/boot/installers
 * @param {ControllerPrototype} proto
 * @param {Hash} ctx
 * @constructor
 *
 */
function Controller(proto, ctx) {

	this.proto = proto;
	this.ctx = ctx;
	/**
	 * controller will install a controller
	 *
	 * @param {Extension} ext
	 *
	 */
	this.controller = function(ext) {

		ext.controller.prototype = this.proto;
		console.log('called');
		this.ctx.controllers.add(new ext.controller(
			this.ctx.store,
			this.ctx.data,
			this.ctx.runtime,
			this.ctx.config,
			this.ctx.factories,
			this.ctx.controllers));

		console.log('DEBUG: Load controller extension:', ext.name);
	};

}
Controller.prototype = require('./PrototypeInstaller');
module.exports = Controller;
