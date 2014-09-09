/**
 * CartAdderDirective is a directive for providing the
 * add to cart button's functionality.
 *
 * @class CartAdderDirective
 * @constructor
 *
 */
module.exports = function CartAdderDirective() {
	return {

		scope: {
                        'bounds': '&',
			'addSuccess': '&',
			'addFailure': '&',
			'id': '@'
		},
		restrict: 'E',
		controller: ['CartService', '$scope', require('./CartAdderController')],
		controllerAs: 'product',
		template: require('./cart-adder.html')
	};

};
