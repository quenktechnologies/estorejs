/**
 * AddButtonDirective is a directive for providing the
 * add to cart button's functionality.
 *
 * @class AddButtonDirective
 * @constructor
 *
 */
module.exports = function AddButtonDirective() {
	return {

		scope: {
			'id': '@'
		},
		restrict: 'AE',
		controller: ['CartService', '$scope', require('./ButtonController')],
		controllerAs: 'product',
		template: require('./add-to-cart.html')	};

};
