var NewCustomerEvent = require('./NewCustomerEvent');
/**
 * SignUpAssistant provides help for code that needs to signup a customer.
 * @alias SignUpAssistant
 * @memberOf core/customer/signup
 * @param {String} domain
 * @param {EStore} store
 * @param {SignUpAssistantCallbacks} callbacks
 * @constructor
 */
module.exports = function SignUpAssistant(domain, store, callbacks) {

	/**
	 * onValidationFinished is a method essentially passed
	 * to passport.js as a callback.
	 *
	 * @param {Error} err
	 * @param {CustomerHash} customer
	 * @param {Object} errors
	 *
	 */
	this.onValidationFinished = function(err, customer, errors) {

		if (err)
			return callbacks.onUnknownError(err);

		if (errors)
			return callbacks.onValidationError(errors);

		store.getDataModel('Customer', true, customer).
		saveQStyle().
		then(function(saved) {

			var customer = saved.toObject();
			customer.domain = domain;

			customer.registrationLink = domain + '/signup/activate/' +
				customer.tokens.validate;

			callbacks.onCustomerRegistered(customer);

			store.
                  mediator.
			onCustomerRegistered(new NewCustomerEvent(customer));

		}).then();

	};





};
