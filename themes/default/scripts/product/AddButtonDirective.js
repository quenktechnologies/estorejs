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
		controller: 'AddButton',
		controllerAs: 'product',
		template: '<label>Quantity:</label>' +
			'<input type="text" value="1" ng-model="product.quantity">' +
			'<button ng-click="product.addToCart()" ' +
			'class="btn btn-fefault cart" type="button">' +
			'<i class="fa fa-shopping-cart"></i>' +
			' Add to cart' +
			'</button>'
	};

};
