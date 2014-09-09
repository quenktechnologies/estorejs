/**
 * CheckoutCartDirective for the shopping cart.
 * @class CheckoutCartDirective
 *
 * @constructor
 *
 */
module.exports = function CheckoutCartDirective() {

	return {

		scope: {},
		restrict: 'AE',
		controller: ['CartService', require('./CheckoutCart')],
		controllerAs: 'cart',
		template: require('./cart.html')


	};


};
