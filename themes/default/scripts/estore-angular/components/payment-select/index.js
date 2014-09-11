/**
 * PaymentSelectDirective
 * @class PaymentSelectDirective
 * @constructor
 *
 */
module.exports = function PaymentSelectDirective() {


	return {

		restrict: 'AE',
		scope: {
			model: '=model',
			options: '=options',
                          required: '@'
		},
		template: require('./payment-select.html')


	};



};
