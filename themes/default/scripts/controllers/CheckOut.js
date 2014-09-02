/**
 * CheckOutController is the controller for the whole checkout process.
 * @class CheckOutController
 *
 * @constructor
 *
 */
module.exports = function CheckOutController($scope, cartService) {

	this.order = {
		customer: {
			email: ''
		},
		address: {
			billing: {
				name: {}
			},
			shipping: {
				name: {}
			}
		}
	};

	this.SHIP_TO_BILLING = false;
	$scope.order = this.order;

	/**
	 * confirm is called when the user confirms the order.
	 *
	 * @method confirm
	 * @return
	 *
	 */
	this.confirm = function() {

		if (this.SHIP_TO_BILLING)
			this.order.address.shipping = this.order.address.billing;
		console.log(this.order);
		cartService.checkout(this.order).
		then(function(res) {
			window.location = "/checkout/success";
			console.log(res);

		}).
		then(null, function(res) {
			//window.location = "/checkout/error";
			console.log(res);


		});
	};

	/**
	 * toggleShipping
	 *
	 * @method toggleShipping
	 * @return
	 *
	 */
	this.toggleShipping = function() {

		this.SHIP_TO_BILLING = !this.SHIP_TO_BILLING;


	};

	var self = this;

	(function($scope) {

		//Init code 
		$scope.$watch(angular.bind(self, function() {

				return self.SHIP_TO_BILLING;

			}),
			function(neu, alt) {

				if (neu)
					self.order.address.shipping = self.order.address.billing;
				if (!neu)
					self.order.address.shipping = {};


			});
		self.toggleShipping();


	}($scope));




};
