/**
 * PaymentBindings
 * @class PaymentBindings
 *
 * @constructor
 * @param {Estore} store
 *
 */
module.exports = function PaymentBindings(store) {

	/**
	 * onPaymentOptionsRequest
	 *
	 * @method PaymentOptionsRequest
	 * @param {Object} req The express Request object.
	 * @param {Object} res The express Response object.
	 * @return
	 *
	 */
	this.onPaymentOptionsRequest = function(req, res) {


		return res.json([{

			name: 'Credit Card',
			value: 'cc',

		}, {
			name: 'Bank Deposit',
			value: 'bank'
		}]);


	};

	/**
	 * main
	 *
	 * @method main
	 * @param {Object} app
	 * @return
	 *
	 */
	this.main = function(app) {

		app.get('/_/payments/options', this.onPaymentOptionsRequest);

	};




};
