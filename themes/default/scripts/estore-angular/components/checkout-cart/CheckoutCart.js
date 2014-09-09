/**
 * CheckoutCart is the main controller for the shopping cart.
 * @class CheckoutCart
 * @param {CartService} service
 * @constructor
 *
 */
module.exports = function CheckoutCart(service) {


	this.items = [];
	this.total = '0';
	var self = this;

	(function() {

		service.get().
		then(function(res) {
			angular.forEach(res.data, function(v, k) {
				self.items.push(v);
			});

		});



	})();

	/**
	 * checkout the cart.
	 *
	 * @method checkout
	 *
	 * @return
	 *
	 */
	this.checkout = function() {
		window.location = "/checkout";
	};



};
