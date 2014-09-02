/**
 * PaymentSelectDirective
 * @class PaymentSelectDirective
 * @constructor
 *
 */
module.exports = function PaymentSelectDirective() {


	return {

		restrict: 'AE',
		require: 'ngModel',
		controller: ['PaymentService', require('./PaymentSelectController')],
                controllerAs:'select',
		scope: {
			ngModel: '=bind'
		},
		template: require('./payment-select.html')


	};



};
