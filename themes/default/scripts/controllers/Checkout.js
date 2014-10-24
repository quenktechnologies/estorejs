/**
 * Checkout is the controller for the whole checkout process.
 * @class Checkout
 *
 * @constructor
 *
 */
module.exports = function Checkout($scope, cartService, configService, $window) {

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
		},
		workflow: ''
	};

	this.SHIP_TO_BILLING = false;
	this.paymentOptions = [];
	this.countries = [];
	$scope.order = this.order;

	/**
	 * confirm is called when the user confirms the order.
	 *
	 * @method confirm
	 * @return
	 *
	 */
	this.confirm = function() {

		var that = this;

		if (this.SHIP_TO_BILLING)
			this.order.address.shipping = this.order.address.billing;

		cartService.checkout(this.order).
		then(function(res, data, headers) {

			if (res.data.paymentUrl)
				return $window.location.href = res.data.paymentUrl;

			window.location = res.headers('x-checkout-url');

		}).
		then(null, function(res) {
			window.location = '/checkout/error';

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

	(function(configService) {

		configService.getPaymentOptions().
		then(function(res) {

			self.paymentOptions = res.data;

		});

		configService.getCountriesSupported().
		then(function(res) {

			res.data.forEach(function(each) {

				self.countries.push(each);

			});

		});

	})(configService);




};
