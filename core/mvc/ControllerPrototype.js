/**
 * ControllerPrototype is the prototype for all Controller constructors.
 * @alias ControllerPrototype
 * @memberOf core/mvc
 * @abstract
 * @constructor
 * @param {EStore} store
 * @param {DataAccess} data
 * @param {Runtime} runtime
 * @param {Configuration} config
 * @param {Factories} factories
 * @param {ControllerIterator} controllers
 *
 */
function ControllerPrototype(store, data, runtime, config, factories, controllers) {

	this.store = store;
	this.data = data;
	this.runtime = runtime;
	this.config = config;
	this.factories = factories;
	this.controllers = controllers;
}

/**
 * initialize is called to bootstrap the Controller.
 *
 */
ControllerPrototype.prototype.initialize = function() {};

/**
 * add a Controller to the internal set.
 * @param {Controller} ctl
 *
 */
ControllerPrototype.prototype.add = function(ctl) {
	this.controllers.push(ctl);
	return this;
};


/**
 * onPreRouteConfiguration is called before the app router is
 * initialized.
 *
 * @param {Application} app
 *
 */
ControllerPrototype.prototype.onPreRouteConfiguration = function(app) {};

/**
 * onRouteConfiguration is called to configure the application routes.
 * @param {Application} app
 */
ControllerPrototype.prototype.onRouteConfiguration = function() {};

/**
 * onGetPaymentOptions is called by payment processing code
 * to construct a list of available payment options.
 *
 * @param {Hash} options
 *
 */
ControllerPrototype.prototype.onGetPaymentOptions = function(options) {};


/**
 * onGetGateways is called by payment processing code to get the actual
 * processors.
 * @param {Hash} gateways
 *
 */
ControllerPrototype.prototype.onGetGateways = function(gateways) {};


/**
 * render is a helper for simply rendering a template for a route.
 * @param {String} template
 * @param {Hash} ctx
 *
 */
ControllerPrototype.prototype.render = function(template, ctx) {

	return function(req, res, next) {

		res.render(template, ctx);

	};


};

module.exports = ControllerPrototype;
