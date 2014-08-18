/**
 * CheckOutController is the controller for the whole checkout process.
 * @class CheckOutController
 *
 * @constructor
 *
 */
module.exports = function CheckOutController($scope, cartService) {

	var self = {

		order: {
			customer: {},
			address: {
				billing: {
					name: {}
				},
				shipping: {
					name: {}
				}
			}
		}

	};

	self.SHIP_TO_BILLING = true;


	$scope.order = self.order;

	/**
	 * confirm is called when the user confirms the order.
	 *
	 * @method confirm
	 * @return
	 *
	 */
	self.confirm = function() {

		if (self.SHIP_TO_BILLING)
			self.order.address.shipping = self.order.address.billing;

		cartService.checkout(self.order).
		then(function(res) {
			window.location = "/checkout/success";

		}).
		then(null, function(res) {
			window.location = "/checkout/error";

		});
	};

	return self;


};
