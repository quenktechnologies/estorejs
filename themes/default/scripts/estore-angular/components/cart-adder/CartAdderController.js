/**
 * CartAdderController is the controller for the CartAdderControllerDirective.
 * @class CartAdderController
 *
 * @constructor
 *
 */
module.exports = function CartAdderController(cart, $scope) {

	var self = {
		id: $scope.id,
		quantity: "1",
	};

	/**
	 * addToCart adds the item to the cart.
	 *
	 * @method addToCart
	 * @return
	 *
	 */
	self.addToCart = function() {

		cart.add(self.id, self.quantity).
		then(function() {

			$scope.addSuccess();
		}).
		then(null, function() {

			$scope.addFailure();

		});

	};


	return self;


};
