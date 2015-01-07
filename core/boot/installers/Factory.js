var Controller = require('./Controller');
var Daemon = require('./Daemon');
var Engine = require('./Engine');
var Gateway = require('./Gateway');
var Model = require('./Model');
var ModelCompiler = require('../../models/ModelCompiler');
var ModelCompilerSyntax = require('../../models/ModelCompilerSyntax');
var Service = require('./Service');
var Settings = require('./Settings');
var Composite = require('./Composite');
var ControllerPrototype = require('../../mvc/ControllerPrototype');

/**
 * InstallerFactory
 */
module.exports = {

	/**
	 *
	 * create the Installer object the main object needs.
	 * @todo break out into smaller factories?
	 * @param {Object} ctx
	 *
	 */
	create: function(ctx, store, config, gateways, engines) {

		var controller = new Controller(
			new ControllerPrototype(
				ctx.store,
				ctx.store,
				ctx.runtime,
				ctx.config,
				ctx.factories,
				ctx.controllers), ctx);

		var daemon = new Daemon(ctx.store);
		var engine = new Engine(ctx.engines);
		var gateway = new Gateway(ctx.gateways);
		var model = new Model(ctx.modelCompiler);
		var service = new Service(ctx.store);
		var settings = new Settings(controller);
		var composite = new Composite(controller);

		//Be careful not to introduce circular references here
		//The settings installer wraps up settings sections and puts
		//back on the chain. The composite installer does the same without the wrapping.

		controller.
		setNext(daemon).
		setNext(engine).
		setNext(gateway).
		setNext(model).
		setNext(service).
		setNext(settings).
		setNext(composite);
		return controller;

	}



};
