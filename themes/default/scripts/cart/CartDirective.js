/**
 * CartDirective for the shopping cart.
 * @class CartDirective
 *
 * @constructor
 *
 */
module.exports = function CartDirective() {

	return {

		scope: {},
		restrict: 'AE',
		controller: 'CartApplication',
		controllerAs: 'cart',
		templateUrl: '/assets/partials/seller/cart/cart.html'


	};


};
