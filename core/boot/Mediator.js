/**
 * @module
 */


/**
 * Mediator for different events within the system.
 *
 * @todo In future releases this will be decomposed into seperate
 * objects that correspond to different paths of the system. That is to
 * say, don't get to say don't depend on it too much.
 * @alias Mediator
 *
 * @constructor
 *
 */
module.exports = function Mediator(store) {

	/**
	 * onSettingsChanged is called whenever the settings changed.
	 *
	 * @param {SettingsHash} settings
	 *
	 */
	this.onSettingsChanged = function(settings) {

		if (!settings)
			settings = {};

		store.settings = settings;
			store.broadcast(store.SETTINGS_CHANGED, settings);

	};



	/**
	 * customerRegistered called when a customer is registered.
	 * @param {NewCustomerEvent} evt
	 *
	 */
	this.onCustomerRegistered = function(evt) {

		var conf = {};

		if (process.env.DOMAIN)
			conf.from = 'noreply@' + process.env.DOMAIN;

		store.broadcast(store.OUTBOUND_MAIL, evt.toEmail(conf));
		store.broadcast(store.CUSTOMER_CREATED, evt);

	};





};
