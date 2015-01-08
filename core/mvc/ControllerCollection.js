/**
 * ControllerCollection is the prototype for all Controller constructors.
 * @alias ControllerCollection
 * @memberOf core/mvc
 * @constructor
 *
 */
function ControllerCollection() {
	this.controllers = [];
}

/**
 * initialize is called to bootstrap the Controller.
 *
 */
ControllerCollection.prototype.initialize = function() {};

/**
 * add a Controller to the internal set.
 * @param {Controller} ctl
 *
 */
ControllerCollection.prototype.add = function(ctl) {
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
ControllerCollection.prototype.onPreRouteConfiguration = function(app) {
	this.controllers.forEach(function(next) {

		next.onPreRouteConfiguration(app);

	});
};

/**
 * onRouteConfiguration is called to configure the application routes.
 * @param {Application} app
 */
ControllerCollection.prototype.onRouteConfiguration = function(app) {

	this.controllers.forEach(function(next) {
		next.onRouteConfiguration(app);
	});

};

/**
 * onGetPaymentOptions is called by payment processing code
 * to construct a list of available payment options.
 *
 * @param {Hash} options
 *
 */
ControllerCollection.prototype.onGetPaymentOptions = function(options) {

	this.controllers.forEach(function(next) {

		next.onGetPaymentOptions(options);

	});

};


/**
 * onGetGateways is called by payment processing code to get the actual
 * processors.
 * @param {Hash} gateways
 *
 */
ControllerCollection.prototype.onGetGateways = function(gateways) {

	this.controllers.forEach(function(next) {

		next.onGetGateways(gateways);

	});
};
module.exports = ControllerCollection;
