/**
 * CartService is a wrapper around the cart endpoints.
 * @class CartService
 *
 * @constructor
 *
 */
module.exports = function CartService($http) {

	var self = {};

	/**
	 * add and item to the cart.
	 *
	 * If the quantity is not specified, the default of 1 is assumed.
	 * The id should be the _id field of the product used in the database.
	 *
	 *
	 * @method add
	 * @param {String} id
	 * @param {Number} quantity=1
	 * @return {HttpPromise}
	 *
	 */
	self.add = function(id, quantity) {
		quantity = quantity || 1;

		return $http.put('/_/cart/items/' + id, {
			_id: id,
			quantity: quantity
		});


	};

	/**
	 * remove issues a request to remove an item from the cart.
	 *
	 * @method remove
	 * @param {String} id
	 * @return {HttpPromise}
	 *
	 */
	self.remove = function(id) {

		return $http.delete('/_/cart/items/' + id);

	};

	/**
	 * exists issues a request to determine if an item is in the cart.
	 *
	 * @method exists
	 * @param {String} id
	 * @return {HttpPromise}
	 *
	 */
	self.exists = function(id) {

		return $http.head('/_/cart/items/' + id);
	};

	/**
	 * get issues a request for the items in the cart.
	 *
	 * @method get
	 * @return {HttpPromise}
	 *
	 */
	self.get = function() {

		return $http.get('/_/cart/items');



	};

	/**
	 * checkout issues a request to checkout the cart.
	 *
	 * @method checkout
	 * @return {HttpPromise}
	 *
	 */
	self.checkout = function(checkout) {

		return $http.post('/_/checkout/transactions', checkout);

	};


	/**
	 * count issues a request for the current count of the cart.
	 *
	 * @method count
	 * @return
	 *
	 */
	self.count = function() {

		return $http.get('/_/cart/items/count');


	};

	return self;



};
