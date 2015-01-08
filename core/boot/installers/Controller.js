var _ = require('lodash');
/**
 * Controller installs controllers.
 * @todo break up to support multiple controller types.
 * @alias Controller
 * @memberOf core/boot/installers
 * @param {ControllerPrototype} proto
 * @param {Hash} ctx
 * @param {Function:Controller} cons
 * @constructor
 *
 */
function Controller(ctx, cons) {

	this.ctx = ctx;
	this.cons = cons;

	/**
	 * controller will install a controller
	 *
	 * @param {Extension} ext
	 *
	 */
        this.controller = function(ext) {

          var newProto =  Object.create(this.cons.prototype);
          _.mixin(newProto, ext.controller.prototype);
          ext.controller.prototype = newProto;
		ext.controller.prototype.constructor = ext.controller;
		ext.controller.$parent = this.cons;

		this.ctx.controllers.add(

			new ext.controller(
				this.ctx.store,
				this.ctx.data,
				this.ctx.model,
				this.ctx.config,
				this.ctx.factories,
				this.ctx.routes));
	};

}
Controller.prototype = require('./PrototypeInstaller');
module.exports = Controller;
