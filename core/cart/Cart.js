/**
 * Cart provides an abstraction around req.session.cart to make
 * interacting with it easier.
 * @memberOf core/cart
 * @param {Array} cart
 * @constructor
 *
 */
function Cart(cart) {
	this.cart = cart;
}


/**
 * add an item to the cart.
 *
 * @param {Item} item
 * @return {Cart}
 */
Cart.prototype.add = function(item) {

	this.cart.forEach(function(cartItem, index) {

		if (item.uuid === cartItem.uuid)
			this.cart.splice(index, 1);
	}.bind(this));

	this.cart.push(item);

	return this;
};


/**
 * hasUUID
 *
 * @param {String} uuid
 *
 */
Cart.prototype.hasUUID = function(uuid) {

	var flag = false;

	if (!uuid)
		return flag;

	this.cart.forEach(function(item) {

		if (item.uuid === uuid)
			flag = true;

	});

	return flag;


};


/**
 * removeUUID removes an item by its uuid.
 *
 * @param {String} uuid
 * @return {Item} The item removed.
 *
 */
Cart.prototype.removeUUID = function(uuid) {

	var found;

	this.cart.forEach(function(item, index) {

		if (uuid === item.uuid) {
			this.cart.splice(index, 1);
			found = item;
		}

	}.bind(this));

	return found;



};


/**
 * each calls a function on each item in the cart.
 *
 * @param {Function} f
 *
 */
Cart.prototype.each = function(f) {

	this.cart.forEach(f);

};

module.exports = Cart;
