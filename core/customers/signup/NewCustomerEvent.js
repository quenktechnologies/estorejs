/**
 * NewCustomerEvent represents the registration of a customer.
 * @alias NewCustomerEvent
 * @memberOf core/customers/signup
 * @param {Object} customer
 * @constructor
 *
 */
module.exports = function NewCustomerEvent(customer) {

	/**
	 * toEmail
	 * @param {Object} conf
	 * @return {Object}
	 *
	 */
	this.toEmail = function(conf) {
		conf.template = 'customers/signup';
		conf.to = customer.email;
		conf.from = conf.from || 'no-reply@' + customer.domain;
		conf.subject = conf.subject || 'Verify your account';
		conf.customer = customer;
		return conf;

	};


};
