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
		controller: ['CartService', require('./ShoppingCartController')],
		controllerAs: 'cart',
		template: require('./shopping-cart.html')


	};


};
