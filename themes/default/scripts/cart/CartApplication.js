/**
 * CartApplication is the main controller for the shopping cart.
 * @class CartApplication
 * @param {CartService} cart
 * @param {EventEmitter} events
 * @constructor
 *
 */
module.exports = function CartApplication(cart, events) {

	var self = {

		items: [],
		total: '0'
	};

	/**
	 * recalculate the value of the items in the cart.
	 *
	 * @method recalculate
	 * @return
	 *
	 */
	self.recalculate = function() {

		var Big = require('bignumber.js');

		angular.forEach(self.items, function(item) {

			item.subtotal = Big(item.price).times(item.quantity);
			self.total = Big(self.total).plus(item.subtotal).toString();
			item.subtotal = item.subtotal.toString();


		});


	};


	/**
	 * modify the quantity of an item in the cart.
	 *
	 * @method modify
	 * @param {CartItem} item
	 * @param {Number} x
	 * @return
	 *
	 */
	self.modify = function(item, x) {

		item.quantity = item.quantity + (1 * x);
		//In the future this should emit an event.
		cart.add(item._id, item.quantity).then(function() {

			self.recalculate();

		});



	};


	/**
	 * remove an item
	 *
	 * @method remove
	 * @param {Object} item
	 * @return
	 *
	 */
	self.remove = function(item) {

		cart.remove(item._id).
		then(function() {

			self.recalculate();
			angular.forEach(self.items, function(current, position) {

				if (current._id === item._id)
					self.items.splice(position, 1);

			});
		});



	};

	/**
	 * getItems gets the items in the cart.
	 *
	 * The items are stored in the property items.
	 *
	 * @method getItems
	 * @return
	 *
	 */
	self.getItems = function() {

		cart.get().
		then(function(res) {

			angular.forEach(res.data, function(v, k) {

				self.items.push(v);

			});

		});


	};


	/**
	 * checkout the cart.
	 *
	 * @method checkout
	 *
	 * @return
	 *
	 */
	self.checkout = function() {
		window.location = "/checkout";
	};

	return self;


};
