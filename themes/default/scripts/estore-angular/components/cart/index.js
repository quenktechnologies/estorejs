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
		controller: ['CartService', require('./CartController')],
		controllerAs: 'cart',
		template: require('./cart.html')


	};


};
