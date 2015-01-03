/**
 * ControllerPrototype is the prototype for all Controller constructors.
 * @alias ControllerPrototype
 * @memberOf core/mvc
 * @abstract
 * @constructor
 *
 */
function ControllerPrototype() {}

/**
 * initialize is called to bootstrap the Controller.
 *
 */
ControllerPrototype.prototype.initialize = function() {



};


/**
 * onRouteConfiguration is called to setup routing for the application.
 *
 * params
 *
 */
ControllerPrototype.prototype.onRouteConfiguration = function() {



};


/**
 * onGetPaymentOptions is called by payment processing code
 * to construct a list of available payment options.
 *
 * params
 *
 */
ControllerPrototype.prototype.onGetPaymentOptions = function() {



};


/**
 * onGetGateways is called by payment processing code to get the actual
 * processors.
 * params
 *
 */
ControllerPrototype.prototype.onGetGateways = function() {



};



module.exports = ControllerPrototype;
