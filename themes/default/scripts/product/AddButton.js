/**
 * AddButton is the controller for the AddButtonDirective.
 * @class AddButton
 *
 * @constructor
 *
 */
module.exports = function AddButton(cart, $scope) {

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

			window.location = '/cart?itemAdded=' + self.id;


		});

	};


	return self;


};
