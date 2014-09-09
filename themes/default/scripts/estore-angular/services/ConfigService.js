/**
 * ConfigService is a wrapper for the various config endpoints.
 * @class ConfigService
 *
 * @constructor
 * @param {Object} $http
 *
 */
module.exports = function ConfigService($http) {

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


	/**
	 * getCountriesSupported fetches a list of countries supported by the
	 * store.
	 *
	 * @method getCountriesSupported
	 * @return
	 *
	 */
	this.getCountriesSupported = function() {

		return $http.get('/_/countries');


	};


        return this;





};
