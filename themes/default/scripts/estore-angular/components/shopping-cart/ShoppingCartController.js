/**
 * CartApplication is the main controller for the shopping cart.
 * @class CartApplication
 * @param {CartService} service
 * @constructor
 *
 */
module.exports = function CartApplication(service) {


	this.items = [];
	this.total = '0';

	/**
	 * recalculate the value of the items in the cart.
	 *
	 * @method recalculate
	 * @return
	 *
	 */
	this.recalculate = function() {

		var Big = require('bignumber.js');

		angular.forEach(this.items, function(item) {

			item.subtotal = Big(item.price).times(item.quantity);
			this.total = Big(this.total).plus(item.subtotal).toString();
			item.subtotal = item.subtotal.toString();


		}.bind(this));


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
	this.modify = function(item, x) {

		item.quantity = item.quantity + (1 * x);
		//In the future this should emit an event.
		service.add(item._id, item.quantity).then(function() {

			this.recalculate();

		}.bind(this));



	};


	/**
	 * remove an item
	 *
	 * @method remove
	 * @param {Object} item
	 * @return
	 *
	 */
	this.remove = function(item) {

		service.remove(item._id).
		then(function() {

			this.recalculate();
			angular.forEach(this.items, function(current, position) {

				if (current._id === item._id)
					this.items.splice(position, 1);

			}.bind(this));
		}.bind(this));



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
	this.getItems = function() {

		service.get().
		then(function(res) {

			angular.forEach(res.data, function(v, k) {

				this.items.push(v);

			}.bind(this));

		}.bind(this));


	};


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
