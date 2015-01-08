/**
 * AppModel
 * @alias AppModel
 * @constructor
 *
 */
function AppModel(store, controllers, config) {

	this.store = store;
	this.controllers = controllers;
	this.config = config;
}

/**
 * onSettingsChanged is called whenever the settings changed.
 *
 * @param {SettingsHash} settings
 *
 */
AppModel.prototype.onSettingsChanged = function(settings) {

	if (!settings)
		settings = {};

	this.config.setPreferences(settings);
	this.store.settings = settings;
	this.store.broadcast(this.store.SETTINGS_CHANGED, settings);

};

/**
 * customerRegistered called when a customer is registered.
 * @param {NewCustomerEvent} evt
 *
 */
AppModel.prototype.onCustomerRegistered = function(evt) {

	var conf = {};

	if (process.env.DOMAIN)
		conf.from = 'noreply@' + process.env.DOMAIN;

	this.store.broadcast(this.store.OUTBOUND_MAIL, evt.toEmail(this.conf));
	this.store.broadcast(this.store.CUSTOMER_CREATED, evt);

};


/**
 * onGetPaymentOptions
 *
 * params
 *
 */
AppModel.prototype.onGetPaymentOptions = function(options) {
	this.controllers.onGetPaymentOptions(options);

};

/**
 * onGetGateways
 *
 * params
 *
 */
AppModel.prototype.onGetGateways = function(gateways) {

	this.controllers.onGetGateways(gateways);


};

module.exports = AppModel;
