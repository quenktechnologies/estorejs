/**
 * PaymentService is a wrapper for the payments endpoints.
 * @class PaymentService
 *
 * @constructor
 * @param {Object} $http
 *
 */
module.exports = function PaymentService($http) {


	/**
	 * getPaymentOptions returns a list of options for payment.
	 *
	 * @method getPaymentOptions
	 * @return {HttpService}
	 *
	 */
	this.getPaymentOptions = function() {

		return $http.get('/_/payments/options');


	};





};
